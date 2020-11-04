# Interactive API

Our next step is to build an Administrator Panel which can be used to fire off API calls. This panel will be used by the host of the game to push questions and answers to the clients. In previous meetings, the UnicornTrivia dev team has settled on GraphQL to implement the api backend. Due to time to market being a critical business driver, we have decided on using a managed GraphQL service and due to its tight integration with AWS services, [AWS AppSync](https://aws.amazon.com/appsync/) will be the managed service of choice to serve our back end requests.

We will also be using the [AWS Amplify](https://aws-amplify.github.io/) library to effortlessly configure backends. We will be using the templating engine within [AWS Amplify](https://aws-amplify.github.io/) called CodeGen to quickly template the structure of our api and our live streaming infrastructure without hand writing any code! 

1. Now that we have a live streaming running we now need to create an interactive API to push questions to all of our users and collect responses from the users. To get started, run 
    ```amplify api add```
1. Follow the prompts shown below.
    <pre>
    UnicornLive $ <b>amplify api add</b>

    ? Please select from one of the below mentioned services: GraphQL
    ? Provide API name: <b>UnicornLive</b>
    ? Choose the default authorization type for the API: <b>Amazon Cognito User Pool</b>
    </pre>

    We take advantage of the built in Auth component for Amplify to add basic authentication to our application. We will keep with the defaults as it supports what we need for our application.

    <pre>
    Do you want to use the default authentication and security configuration? <b>Default config
    uration</b>
    How do you want users to be able to sign in? <b>Username</b>
    Do you want to configure advanced settings? <b>No, I am done.</b>
    Successfully added auth resource
    </pre>

    Now that we have our Auth resource setup we can now setup our GraphQL schema. 

    <pre>
    ? Do you want to configure advanced settings for the GraphQL API: <b>No, I am done.</b>
    ? Do you have an annotated GraphQL schema? <b>No</b>
    ? Do you want a guided schema creation? <b>Yes</b>
    ? What best describes your project: <b>Single object with fields (e.g., “Todo” with ID, name
    , description)</b>
    ? Do you want to edit the schema now? <b>Yes</b>

    ? Press enter to continue 
    </pre>
    1. This will open your default editor with a default GraphQL model:
        ```graphql
        type Todo @model {
           id: ID!
           name: String!
           description: String
        }
        ```
    1. Change the model to:
       ```graphql
        type Question @model (subscriptions: {level: public}) @auth
        {
            id: ID!
            question: String!
            answers: [String]!
            answerId: Int
        }

        type Answer @model @key(fields: ["owner", "gameID"])
        @auth(
            rules: [
                {allow: owner, ownerField: "owner"}
            ]
        )
        {
            owner: String!
            gameID: ID!
            answer: [Int]
        }
       ```
    1. Save the file you just edited using your text editor.
1. Each one of these models will have a DynamoDB table associated with it and each will be connected to AppSync through Resolvers. Resolvers are how AWS AppSync translates GraphQL requests and fetches information from your AWS resources (in this case the DynamoDB table). Resolvers can also transform the information sent to and received from your AWS resources. We will dive deeper in a later section on this.
1. Now run `amplify push` to create the backend resources.
    <pre>
    UnicornLive $ <b>amplify push</b>
    ? Do you want to generate code for your newly created GraphQL API <b>Yes</b>
    ? Choose the code generation language target <b>javascript</b>
    ? Enter the file name pattern of graphql queries, mutations and subscriptions <b>src/graphql/**/*.js</b>
    ? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions <b>Yes</b>
    ? Enter maximum statement depth [increase from default if your schema is deeply nested] <b>2</b>
    </pre>
1. Time to jump to writing some code. Let's get started by creating the Admin Panel [Here](./Admin.md)