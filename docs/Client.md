# Client
1. Now we need to make our client for all of our customers to use. First we need to add Authentication again to our app. We will be doing the same thing we did for the Admin Panel. First we will need to import the helper function and then wrap our component in this.
1. Navigate to `src/components/App/index.jsx` and put this import into `Location 6`
    ```javascript
    import { withAuthenticator } from 'aws-amplify-react';
    ```
1. We will then need to wrap our exports of the App component in `withAuthenticator` again. Go to `Location 7` and replace this code:
    ```javascript
    export default App;
    ```
    with this line:
    ```javascript
    export default withAuthenticator(App);
    ```
1. Now we have Authentication enabled for our default app, you can now move forward with setting up the video stream in the app. Navigate to the main game code: `src/components/Game/index.jsx`.
1. We are going to now import our auto-generated file into our game. This file contains all the info about our live stream. To do this we will add a new imports file at `Location 8`
    ```javascript
    import awsvideoconfig from '../../aws-video-exports';
    ```
1. In the same file now we are going to add a valid source to our video to start our playback. We are going to get this url/source from our `aws-video-exports` file. Find `Location 9` and replace the code found below.
     ```javascript
    const url = '';
    ```
    with this line:
    ```javascript
    const url = awsvideoconfig.awsOutputVideo;
    ```
1. Now if you have stopped your stream you can now start it up again. You should now see your live stream being reflected in the client! Now you can start your show and talking to your customers. Next you need to start showing the questions that you are asking and allowing them to answer the questions. To do this we are going to be a combo of AWS AppSync's subscriptions to receive the questions and Starfruit's Time Metadata API to sync the questions.
1. First we will setup the client to receive the questions and store them and then we will setup AppSync to call Starfruit's Time Metadata API. To get started we are going to import some libraries and some code that was auto generated for us. Place this code at `Location 10`.
    ```javascript
    import { Auth, API, graphqlOperation } from 'aws-amplify';
    import { onCreateQuestion, onUpdateQuestion } from '../../graphql/subscriptions';
    ```
1. Now we will need to setup our subscriptions first. First we will setup the receiving the questions. Place this code into `Location 11`. In this code we are receiving the question info and storing it in our state for later, when we will need to draw the Modal. If you want to see the Modal pop up you can always add `modalVisible:true` to the `setState` call.
    ```javascript
    API.graphql(
      graphqlOperation(onCreateQuestion),
    ).subscribe({
      next: (data) => {
        self.setState({
          drawInfo: data.value.data,
        });
      },
    });
    ```
1. We will setup in the same thing for the Answers, the only difference is that instead of listening for `onCreateQuestion` we are going to be listening for `onUpdateQuestion`. Put this code at `Location 12`
    ```javascript
    API.graphql(
      graphqlOperation(onUpdateQuestion),
    ).subscribe({
      next: (data) => {
        self.setState({
          drawInfo: data.value.data,
          modalVisible: true,
        });
      },
    });
    ```
1. Now we have our subscriptions all set up! We will now receive questions and answers back from our Admin Panel to our client. But we still don't see the Modal popup! We are going to draw the Modal when Starfruit's Time Metadata tells us to. So first we need to make AppSync call Starfruit's Time Metadata. To get started we are going to need to create a new IAM policy to allow Lambda to call our Starfruit API.
1. Navigate to the [IAM Console -> Roles](https://console.aws.amazon.com/iam/home?#/roles). And select `Create Role`.
1. For the trust entity we are going to select `Lambda` from the list and then click the bottom `Next Permissions` button at the bottom.
1. Next you will need to add permission policies. We will need to create a new Policy so select the `Create policy` button on the top of the page. A new tab will be opened and you will need to go to that tab.
1. In this new tab, select the JSON tab and paste in the policy below
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "VisualEditor0",
          "Effect": "Allow",
          "Action": "svs:*",
          "Resource": "*"
        }
      ]
    }
    ```
1. Next select `Review policy`
1. Fill out the form with a new Name for the policy like `Starfruit_Lambda_Policy` and provide a description.
1. Ignore the warning about how this policy doesn't grant any permissions and select `Create Policy`.
1. Switch back to your other tab and select the refresh button on the top right side for the page.
1. Now search for the new policy you just create and select it using the checkbox on the left side of the page.
1. After selecting your newly created policy, click the `Next: Tags` and `Next: Review` button to proceed.
1. Provide a good name for your new Role like `Starfruit_Lambda_Role` and then provide a good description and then select `Complete` at the bottom of the page.
1. Now we can create a Lambda function to call our Starfruit Endpoint. Navigate to [Lambda](https://us-west-2.console.aws.amazon.com/lambda/home?region=us-west-2#/create/function) in the console.
1. We are going to create a new Node.js 12.x function, provide a name for the Lambda function, and in the drop down for Permissions select our existing role that we created previously. It should look something like this: ![lambdaconfig](../images/lambdaconfig.png)
1. We will now have a brand new lambda function. We are going to be uploading a .zip file for our Lambda Function as we need some external packages that Lambda doesn't provide.
1. Download this file: [lambda.zip](./lambda.zip) and upload it your Lambda function. To do this you will need to go to the Function code section and select `Upload a .zip file`. Then select the uplaod button and upload the `lambda.zip` you downloaded earlier. ![lambdaupload](../images/lambdaupload.png)
1. We are now need to configure our Environment Variables to reflect our channel arn that we got from setting up the channel. (To get the channel ARN again if you lost it you can simply run `amplify video get-info`. If it prompts yout to overwrite the exports file you can say yes). You will then need to fill in the enviroment variable with this value. The enviromnent variable is `channelARN` and the value is your channel ARN. This is an example: ![lambdaenv](../images/lambdaenv.png)
1. Now we have fully configured our Starfruit Time Metadate lambda! Now we need to configure AppSync to use the Lambda. Navigate to the [AppSync console](https://us-west-2.console.aws.amazon.com/appsync/home?region=us-west-2#/apis) and find the API name you created and click on it.
1. Now inside your API window, navigate to the `Data Sources` section on the left hand side, to start configuring our Lambda as a new data source.
1. Select the `Create data source` button to get started.
1. Fill out the data source with the information for your Lambda function. It should look something like this: ![appsyncdatasource](../images/appsyncdatasource.png)
1. Click the Create button.
1. Now navigate to the `Functions` on the left hand side. We are going to create a function, that calls our Lambda function. AppSync function are resolvers that can be reused between multiple pipeline resolvers. 
1. Select `Create function`, and fill it out like below: ![appsyncfunction](../images/appsyncfunction)
1. For the Request Mapping Template it should be this:
    ```
    {
      "operation": "Invoke",
      "payload": $util.toJson($context.prev.result)
    }
    ```
1. For the response mapping template it should be:
    ```
    ## Raise a GraphQL field error in case of a datasource invocation error
    #if($ctx.error)
      $util.error($ctx.error.message, $ctx.error.type)
    #end
    $util.toJson($context.prev.result)
    ```
1. Select the complete button at the bottom.
1. Now that we have a new function we now need to add that to our application. Navigate to the `Schema` section the top left side. 
1. On the right side you should see a `Schema` and a `Resolvers` section on your page. On the resolvers section use the Search bar and type in `mutation` to filter your search down to just the mutations.
1. We are going to be editing the Mutation resolver for both `createQuestion` and `updateQuestion`. First let's fix the `createQuestion` mutation. Select the hyperlinked `QuestionTable` resolver.
1. On this new page you will be given an editor to edit the resolver. There is also a button to convert this resolver into a pipeline resolver. Click that button and cofirm the convert. ![appsyncconvert](../images/appsyncconvert.png)
1. Now you have a pipeline resolver that you will need to add the function we created early too! Click on the `Add function` dropdown and select our function we create. It should append the function we create before to the bottom of the pipeline resolver! We have now successfully added Starfruit's Time Metadata to AppSync.
1. Repeat the steps above for `updateQuestion` to add Starfruit's Time Metadata to the other sections.
1. Now that we are syncing with Starfruit Time Metadata we need to make the client aware of this Metadata!
1. Navigate to `src/components/Video/index.jsx`
1. We are first going to add an action to the invoke the callback from the parent view. This takes advantage of the unique player technology that is provided by Starfruit. Place this code in `Location 13`
    ```javascript
    const TwitchTech = this.player.getTwitchTech();
    this.player.addTwitchTechEventListener(TwitchTech.PlayerEvent.METADATA, (metadata) => {
      if (metadata.data.constructor === ArrayBuffer) {
        const enc = new TextDecoder('utf-8');
        parentCallback(enc.decode(metadata.data));
        console.info(enc.decode(metadata.data));
      }
    });
    ```
1. Now that we call our callback to our parent view we can now show our questions to all our users. To set this up go to the `src/components/Game/index.jsx`
1. We now need to add some code to our parent callback. Place this code in `Location 14`
    ```javascript
    const { drawInfo } = this.state;
    let questionId = '';
    if ('onCreateQuestion' in drawInfo) {
      questionId = drawInfo.onCreateQuestion.id;
    } else if ('onUpdateQuestion' in drawInfo) {
      questionId = drawInfo.onCreateQuestion.id;
    }
    if (childData === questionId) {
      this.setState({
        modalVisible: true,
      });
      setTimeout(() => {
        this.setState({
          modalVisible: false,
        });
      }, 10000);
    }
    ```
1. Now whenever we receive a question we will draw the modal view!
1. However we can't receive any answers from our users. So we will now need to setup receiving answers from our users. Before we can receive answers we need to register the user for the game. Place this code in `Location 15`
    ```javascript
    Auth.currentSession()
      .then((data) => {
        API.graphql(
          graphqlOperation(createAnswer, { input: { gameID: '1', owner: data.idToken.payload['cognito:username'] } }),
        ).then(((res) => {
          console.log(res);
        })).catch((err) => {
          console.log('err: ', err);
      });
    });
    ```
1. Now that we have registered our user into the game we now need to start recording their answers to the questions. Navigate to `src/components/Modal/index.jsx`
1. Place this code in `Location 16` to add user responses.
    ```javascript
    API.graphql(
      graphqlOperation(
        updateAnswer,
        {
          input: {
            id,
            answer: [index],
          },
        },
      ),
    ).then((res) => {
      console.log('successfully submitted answer: ', res);
    }).catch((err) => {
      console.log('err: ', err);
    });
    ```
1. Now we are recording their answers. Almost. You will notice that we are only storing the index everytime and not merging the existing array with the new array. So we will need to do this in the backend of AppSync. We are going to do this by modifying another resolver.
1. Open the [AppSync Console](https://console.aws.amazon.com/appsync/home) and navigate to your AppSync endpoint.
1. Once you select your AppSync endpoint on the left side select Schema.
    ![Appsync Schema](.images/Appsync_Schema.png)
1. You now should see your schema that was auto generated for you from Amplify. On the right side you should see a section called Resolvers. Search for `Mutation` in the text box and then select the clickable link next to `updateAnswer(...):Answer`
    ![Appsync Resolver](.images/Appsync_Resolvers.png)
1. You are now presented with a Request Mapping Template and a Response Mapping Template.
    1. We are going to change the Request Mapping Templateto do the appending of the array.
    1. Navigate/search for `#set( $expression = "SET" )` and look for this line (should be near line 78):
        ```vtl
        #set( $expression = "$expression $entry.key = $entry.value" )
        ```
    1. Replace this line with:
        ```vtl
        #if ($util.matches($entry.key, "#answer"))
            #set( $expression = "$expression $entry.key = list_append(if_not_exists($entry.key, :empty_list), $entry.value)" )
            $util.qr($expValues.put(":empty_list", $util.dynamodb.toDynamoDB([])))
        #else
            #set( $expression = "$expression $entry.key = $entry.value" )
        #end
        ```
        This checks to see if the field being set is the answer array. If it is the array then it will append the value. We also do a check to see if the field exists and if it doesn't we create an empty array to append our first value to.
    1. Save the resolver in the top right corner.
1. Run the app again and now you should observe the answers are being correctly appended to the array.

## Step 5: Running the application!

Now that we have every section of the application implemented, it's time to run the app in our emulator.

1. From here run the command `npm start` to launch the application in the browser. The browser window should automatically open up. If not, navigate to the localhost port displayed in the terminal to view the application.
1. From your AdminPanel, you can play along by posting a question, answering the question from the app, and then posting the answer to show you whether you got it correct.