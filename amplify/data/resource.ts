import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";


/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({

  UserProfile: a
    .model({
      email: a.string(),
      profileOwner: a.string(),
    }).authorization((allow) => [allow.ownerDefinedIn("profileOwner")]),

  Todo: a.model({
      content: a.string(),
      value: a.integer(),
      status: a.string(),
    //  isDone: false,
    //}).authorization((allow) => [allow.publicApiKey()]),
    }).authorization(allow => [allow.owner()]),

  Member: a.model({
    name: a.string().required(),
    // 1. Create a reference field
    familyId: a.id(),
    // 2. Create a belongsTo relationship with the reference field
    family: a.belongsTo('Family', 'familyId'),
  })
  .authorization(allow => [allow.publicApiKey()]),

  Family: a.model({
    sirName: a.string().required(),
    // 3. Create a hasMany relationship with the reference field
    //    from the `Member`s model.
    members: a.hasMany('Member', 'familyId'),
  })
  .authorization(allow => [allow.publicApiKey()]),
/****  
  Rule: a.model({
    ruleDesc: a.string().required(),
    familyId: a.id(),
    family: a.belongsTo('Family', 'familyId'),
  })
  .authorization(allow => [allow.publicApiKey()]),
  
  Reward: a.model({
    rewardDesc: a.string().required(),
    value: a.integer().required(),
    familyId: a.id(),
    family: a.belongsTo('Family', 'familyId'),
  })
  .authorization(allow => [allow.publicApiKey()]),
  ****/
}).authorization((allow) => [allow.resource(postConfirmation)]);


export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    //defaultAuthorizationMode: 'userPool',
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});


/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
