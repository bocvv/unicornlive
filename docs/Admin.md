# Admin Panel
1. First we will be working on the Admin panel. To start working on this project though we will need to install a few dependancies. From the terminal on the root UnicornFlix folder run

    ```
    npm install
    ```
1. Now to load up the application so we can see our changes live we will need to run:

    ```
    npm start
    ```
1. Since we are working with the Admin panel we should navigate to the panel in the browser. `npm start` should of opened a window to your `localhost:3000`. Navigate to /admin on localhost like so: `localhost:3000/admin`
1. Now lets open up the folder `UnicornLive` in your favorite text editor.
1. Navigate to the the Admin page: `src/components/Admin/index.jsx`
1. To get started we will first add Authentication to the page so that we can call the API and also to lock down the page.
1. To do this we need to add a new import to our page at `Location 1`
    ```javascript
    import { withAuthenticator } from 'aws-amplify-react';
    ```
1. Now we can use that import at the bottom of the file replacing this line at `Location 2`
    ```javascript
    export default Content;
    ```
    with this line:
    ```javascript
    export default withAuthenticator(Content);
    ```
1. `withAuthenticator` is a React Component provided by Amplify that allows you to drop in Authentication with a pre-coded login page providing default settings like: forgot password, verification for new users and registeration.
1. When the page reloads you will now be prompted to login before you can view the Admin page. Let's go ahead and create a user and log in so that way we can start modifying the code.
1. Now that we have logged in we now have a valid token to start calling our API we created earlier. Let's get to adding the calls to the API. To get started we will first want to import the code that was automatically generated for us by the Amplify CLI at `Location 3`
    ```javascript
    import { API, graphqlOperation } from 'aws-amplify';
    import { createQuestion, updateQuestion } from '../../graphql/mutations';
    ```
1. To create a question we will need to make a Mutation to our API. To make the call we will need to create a input object and then use the Amplify `API.graphql` to call our endpoint. We will be placing this code in `Location 4`
    ```javascript
    const question = {
      input: {
        question: rowData.Question,
        answers: rowData.Answers,
      },
    };
    API.graphql(graphqlOperation(createQuestion, question)).then((response) => {
      rowData.id = response.data.createQuestion.id;
      console.log(response.data.createQuestion);
    });
    ```
1. To push the answer out we will need to modify the existing question that we created above with the AnswerId. We will still use the `API.graphql` but we are replacing the `createQuestion` with an `updateQuestion` and we will need to provide the `id` from the last time we pushed a question. We will be placing this code in `Location 5`
    ```javascript
    if (rowData.id != null) {
      const question = {
        input: {
          id: rowData.id,
          answerId: rowData.Answer,
        },
      };
      API.graphql(graphqlOperation(updateQuestion, question)).then((response) => {
        console.log(response.data.updateQuestion);
      });
    } else {
      console.log('Nothing');
      Popup.alert('Error: You have not submitted this question yet');
    }
    ```
1. BOOM we now have setup our Admin panel. If you would like to see it in action before setting up the User client you can right click on the page and open your developer tools (inspect the page) and you can see in the console the callback from the API.
1. Lets move forward and setup our client now! Click [Here](./Client.md)