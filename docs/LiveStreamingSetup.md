# Live Streaming with Amazon Interactive Video Service
We'll start by building a live streaming service that can receive a source signal from a studio, transcode the source into Adaptive BitRate (ABR), and serve the content to our application. ABR streaming protocols like Apple HTTP Live Streaming (HLS) and MPEG Dynamic Adaptive Streaming over HTTP (DASH) allow clients to access the live stream over any network connection and provide the best viewing experience to users.

Now you need to deploy Amazon Interactive Video Service. Sure, you could use the AWS Console or even AWS CloudFormation, but you're an app developer in a hurry and not interested in writing YAML or JSON. You plan to use AWS Amplify CLI/SDK for the mobile app, maybe there's a way to manage your live streaming infrastructure with the same tools? Luckily, you met a Solutions Architect at the AWS SFO Summit who shared with you a AWS Amplify plugin that does just this very thing. Let's get building!

1. First, we need to change directories to the root folder of our project.

    ```cd UnicornLive```
1. Next we are going to begin development of our Amplify project by using the initialization command.  This command creates new AWS backend resources (in this case a single S3 bucket to host your CloudFormation templates) and pulls the AWS service configurations into the app!

    ```amplify init```
1. Follow the prompts shown below.
    * **PLEASE DOUBLE CHECK THE PROFILE YOU ARE USING.**
    * Note that because of the services leveraged, your AWS profile **MUST USE** us-west-2
    <pre>
    unicornflix $ <b>amplify init</b>
    
    Note: It is recommended to run this command from the root of your app directory
    ? Enter a name for the project: <b>unicornlive</b>
    ? Enter a name for the environment <b>dev</b>
    ? Choose your default editor: <b>None</b>
    ? Choose the type of app that you're building <b>javascript</b>
    Please tell us about your project
    ? What javascript framework are you using <b>react</b>
    ? Source Directory Path:  <b>src</b>
    ? Distribution Directory Path: <b>build</b>
    ? Build Command:  <b>npm run-script build</b>
    ? Start Command: <b>npm run-script start</b>
    Using default provider  <b>awscloudformation</b>

    For more information on AWS Profiles, see:
    https://docs.aws.amazon.com/cli/latest/userguide/cli-multiple-profiles.html

    ? Do you want to use an AWS profile? <b>Yes</b>
    ? Please choose the profile you want to use <b>default</b>
    </pre>
    
    
1. Now, we are going to add the amplify video module to the project.

    ```amplify video add```
1. Follow the prompts as shown below. We'll be building in a basic content management system (CMS) as part of our video-on-demand (VOD) platform.
    <pre>
    UnicornLive <b>$amplify add video</b>
    ? Please select from one of the below mentioned services: <b>Starfruit</b>
    ? Provide a friendly name for your resource to be used as a label for this category in the project: <b>triviastream</b>
    </pre>

    Above we provided a channel name that is used to generate a CloudFormation template that stands up the stream and stream key that you can use.
1. Once the prompt completes you can verify you have a new resource created by running:

    ```amplify status```

    It should look something like this:

    <pre>
    UnicornLive <b>$amplify status</b>
    Current Environment: dev

    | Category | Resource name      | Operation | Provider plugin   |
    | -------- | ------------------ | --------- | ----------------- |
    | Video    | triviastream       | Create    | awscloudformation |
    </pre>
1. Now it is time to create our resources. To do so we can simply run.

    ```amplify push```
    <pre>
    UnicornLive $ <b>amplify push</b>
    ✔ All resources copied.
    ✔ Successfully pulled backend environment dev from the cloud.

    Current Environment: dev

    | Category | Resource name  | Operation | Provider plugin   |
    | -------- | -------------- | --------- | ----------------- |
    | Video    | triviastream   | Create    | awscloudformation |
    ? Are you sure you want to continue? <b>Y</b>
    </pre>
1. It will take a few minutes to stage and create the resources in your AWS environment. So sit back and relax.
1. When the push ends you should be see an output with some information about your stream, looking something like this:
    <pre>
    <u>Starfruit Input Setup:</u>
    Ingest URL: ingest_url
    Ingest Key: ingest_key<br>
    <u>Starfruit Stream URL:</u>
    Output URL: output_url
    </pre>
1. If you haven't already done so, please install OBS at this time by refering to the "Configuring your computer" section for the download link.
1. To setup OBS to start streaming to your newly created endpoint you can run the command `amplify video setup-obs`. This command will setup a OBS profile which is preconfigured. 
1. Now Launch OBS and navigate to the profile menu and select your Project Name. This will switch your settings to a preconfigured profile ready to stream to the livestream. If you don't see your profile listed, try closing the OBS application and re-opening it and check the profile tab again.
![OBS VideoCapture](../.images/OBS_Profile.png)
1. The last step is adding an audio and video source. Under Sources on the bottom left hand side, select the **+** icon to add a source.
1. Choose Video Capture Device. Click the "Create New" radio button and provide a unique name and select ok.
![OBS VideoCapture](../.images/obs_video_capture.png)
1. In the next screen choose your video capturing device(most likely your laptop's built in web cam). Again, select ok.
![OBS ChooseCamera](../.images/obs_choose_camera.png)
1. Finally we need to add an audio source. Again choose the **+** icon in the sources pane. This time choose "Audio Input Capture".
1. Again, make sure the "Create New" radio button is selected and supply a name for the source and select ok. Under device, choose "Built in Microphone" and hit ok.
1. We are now ready to start the stream! Hit the "Start Streaming" button under the "Controls" panel in the bottom right hand side.
1. Now we are going to check out our stream using our test player:
!!!! INSERT URL !!!!

Congratulations! You have now hosting a Live Stream on AWS! Now let's setup the client that will show our stream. [Click Here](./APIConfigure.md) to continue to the next step!