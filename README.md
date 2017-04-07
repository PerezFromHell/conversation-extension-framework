[![Build Status](https://travis-ci.org/pthoresen/conversation-extension-framework.svg?branch=master)](https://travis-ci.org/pthoresen/conversation-extension-framework)
[![Coverage Status](https://coveralls.io/repos/github/pthoresen/conversation-extension-framework/badge.svg?branch=master)](https://coveralls.io/github/pthoresen/conversation-extension-framework?branch=master)

# Watson Conversation Extension Framework
The Watson Conversation Extension Framework is a Node.js tool that allows developers quickly add dynamic functionality to their IBM Watson Conversation powered chatbots. The framework makes it simple to add the following capabilities:

* External API Integrations
* Complex Javascript functions
* Private data storage (easily access private data in Watson Conversation without sending it to the cloud)
* Context management for front-end interfaces that do not persist context (Slack, Facebook Messenger)
* Handle inputs from multiple sources (Slack, Facebook Messenger, etc...) with the same core logic

But most importantly, the framework is designed to **make it simple** to add these capabilities to your application.

#### How simple is it?

Here are few examples of the [IBM Watson Conversation](https://www.ibm.com/watson/developercloud/conversation.html) syntax to use the conversation extension framework:

##### Want to make a call to an external API?
```
{
  "output": {
    "apiCall": "myAPI"
  }
}
```
##### How about if you want to store the user's next response in your context?
```
{
  "output": {
    "updatesContext": "myVariable"
  }
}
```
##### What if you're expecting private data and don't want to send it to Watson Conversation in the context?
```
{
  "output": {
    "updatesContext": "myVariable:private"
  }
}
```
##### Pretty cool?
I bet you want to use that private variable in your conversation responses? To augment your conversation responses with variables from either Watson Conversation's context or your private data inside of your application, simply use

`{{myVariable}}`

in your response text. The framework will replace these tokens with the value of that variable no matter if it was stored in your Watson Conversation context or privately on your application!

##### Ready to get started building that truly dynamic chat bot...?


## Requirements
* Node.js 7.6+
* Your own front-end chat client. (Slack, Facebook Messenger, Web App, etc...) This tool does **NOT** contain any front-end code
* An instance of Watson Conversation on Bluemix

### Note
The Node.js 7.6+ requirement is a hard requirement as this time. It's possible that this can be used on previous versions, but in order to do so, it will need to be transpiled with compatibility for `async/await` and will require a ES2015 polyfill like [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)

## Installation
To install, run the following npm command

`npm install --save conversation-extension-framework`

## Usage
An example implementation is provided at [./example/](./example/).

The conversation extension framework is, at its core, an object. The class needs to be imported

`let ConversationExtension = require('conversation-extension-framework')`

and then initialized

`let conEx = new ConversationExtension(conversationUrl, conversationUser, conversationPassword)`

where:

```
conversationUrl: https://gateway.watsonplatform.net/conversation/api/v1/workspaces/<WORKSPACE_ID>/message?version=<VERSION>
conversationUser: Username from the Watson Conversation credentials (not your bluemix account)
conversationPass: Password from the Watson Conversation credentials (not your bluemix account)
```

API calls are registered to this object using the `addAPI` function

```
conEx.addAPI('myAPI', (usePrivate, context, privateContext) => {
	return new Promise((resolve, reject) => {
		resolve({context, privateContext})
	}
})
```

More details about making API calls in Watson Conversation is available in the **Making API Calls** section

Once the API calls are registered, incoming messages will need to be pushed through the core logic. All messages regardless of source will need to call the `handleIncoming` function.

```
conEx.handleIncoming('my message text', 'user sending the message', 'source of message'))
```

This function will return a `Promise` to return the following object:

```
{
  "responseText": The final augmented text response.
  "userData": {
    "context": the (public) context from Watson Conversation,
    "privateContext": the private application context for the user,
    "responseOptions": {
    	updatesContext: {boolean} if the next user response will update a context value
    	updatesContextType: {string} ('public' | 'private') if the update will occur to context or privateContext
    	updatesContextField: {string} the field name to be updated (...context['fieldName'])
    }
  }
}
```

Once this `Promise` has resolved, there should be sufficient information to respond to the user via their original medium.

## Making API Calls
The framework allows a developer to register functions that return a `Promise` so that they can quickly be called with a single line from Watson Conversation

To register an API call, use the `addAPI` function

```
conEx.addAPI('myAPI', (usePrivate, context, privateContext) => {
	return new Promise((resolve, reject) => {
		resolve({context, privateContext})
	}
})
```

It's very important that these registered functions use a common signature.

```
Arguments:
	usePrivate: {boolean} a flag to indicate to your function if Watson Conversation has designated the implementation to use private or public context data.
	context: {object} the (public) context that is sent back and forth from Watson Conversation
	privateContext: {object} private data that is stored with the application that does not get sent to Watson Conversation

Returns:
	{Promise} that will resolve {context, privateContext}. The logic will use the resolved values to update context and privateContext
```

Once registered, the function can be accessed in Watson Conversation by adding the `apiCall` property to the output of the Watson conversation response.

```
{
  "output": {
    "apiCall": "myAPI"
  }
}
```

When making an API call, the application will `await` the resolution of the returned `Promise`

### Important
After an API call is made, the application will send a followup message back to Watson Conversation with the original message text. If you need to access information that was updated in your context or private context as a result of the API call, it should be done in the conversation node that is executed immediately after the node that requested the API call. More information on accessing context values is provided in **Augmenting the Response**

## Managing User Data

The application is based around the idea of managing two sets context information, *public* and *private*

**Public Context** is the context object that is sent to Watson Conversation as part of the request. It will be availabe inside of Watson Conversation through the standard API and will be visible in plain text through the application.

**Private Context** is maintained in the application's memory and is never sent to Watson Conversation. This makes it appropriate for data that may be sensitive, or simply if it's not important to send to Watson Conversation. When set through the updatesContext response property, it will also update public context with the corresponding value as 'true' to indicate that it is present in the private context.

Both *public* and *private* context can be used to store information to use in API calls as well as to augment the response to the user.

### Maintaining State

One of the key functions is to maintain state at the server side. This will allow conversation to flow when the client cannot manage the conversational context, which is basically any case except where you own the client code yourself.

The application will store public and private context in a hash in the application's memory, and it will retrieve this information by **user id** and **source** as supplied in the *handleIncoming* function. Consider these functions:

```
conEx.handleIncoming('my message text', 'user123', 'web-app'))
AND
conEx.handleIncoming('my message text', 'user123', 'different-web-app'))
```

Even though the user is the same, the application will retrieve two sets of user data, one for messages from user123 originating from web-app and one for user123 originating from different-web-app.

### Storing a User Response

Sometimes a developer will need to store a user's response, for instance, Watson may ask the user a question and need to store that information for later. The application allows for this situation to be quickly and simply addressed with the following syntax on Watson Conversation.

```
{
  "output": {
    "updatesContext": "myVariable"
  }
}

OR

{
  "output": {
    "updatesContext": "myVariable:private"
  }
}
```

The presence of this property will indicate to the framework that the **next** response from the user will be stored in `context.myVariable` or `privateContext.myVariable` (if :private is appended to the field name).

## Augmenting a Response

For the chat bot to truly be dynamic, it's not enough for the bot to simply call external APIs and internal functions, but it needs to tailor its response based on the information retreived in these integrations. Since each API call requires that it returns a `Promise` that will update context and privateContext, we need a way to access this information quickly.

The framework allows a developer to include the following syntax `{{fieldName}}` in their responses. The application will update these references and replace them with the first matching option from the ordered list:

* `privateContext.fieldName`
* `context.fieldName`
* or a placeholder indicating the value was not found

## An Example
Let's walk through the example provided in [./example/](./example/)

There are two main pieces. First let's look at the implementation of the rollDice API in [./example/api/diceRoll.js](./example/api/diceRoll.js). This is just a demo API that will, after 200ms, return a number from 1 to 6.

```
// Example API connection that returns a random dice roll after a short delay.
// Important that these API connections return a Promise!
// This promise should promise to return an updated context and private context
let rollDice = function (usePrivate, context, privateContext) {
  return rollPromise().then((roll) => {
    if (usePrivate) {
      privateContext.diceRoll = roll
    } else {
      context.diceRoll = roll
    }
    return ({context, privateContext})
  })
}

function rollPromise () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random() * 6 + 1))
    }, 200)
  })
}

module.exports = {
  rollDice
}
```

If the API is called from Watson Conversation using `output.apiCall` as 'diceRoll' it will update context.diceRoll with the result. If it is called using `output.apiCall` as 'diceRoll:private', the usePrivate boolean will be set to true, and it will update privateContext.diceRoll with the result.

Next let's look at the implementation of the application code in [./example/server.js](./example/server.js). I've gone ahead and removed many of the comments and unrelated portions for brevity.

```
let express = require('express')
let bodyParser = require('body-parser')

let conversationExtension = new (require('conversation-extension-framework'))(process.env.CONVERSATION_API_URL, process.env.CONVERSATION_API_USER, process.env.CONVERSATION_API_PASSWORD)

conversationExtension.addAPI('diceRoll', require('./api/diceRoll').rollDice)

let app = express()
app.use(bodyParser.json())

// Mock Incoming message
// body.text: message to send
// body.user: 'user' sending the message
app.post('/incoming', async (req, res, next) => {
  res.status(200).send(await conversationExtension.handleIncoming(req.body.text, req.body.user, 'mock-api'))
})

```

The `ConversationExtension` class is initialized with the Watson Conversation credentials

`let conversationExtension = new (require('../'))(process.env.CONVERSATION_API_URL, process.env.CONVERSATION_API_USER, process.env.CONVERSATION_API_PASSWORD)`

Then the aforementioned diceRoll API is registered.

`conversationExtension.addAPI('diceRoll', require('./api/diceRoll').rollDice)`

And a request handler is registered with `express` to simulate an interface that will handle an incoming message from the user.

```
app.post('/incoming', async (req, res, next) => {
  ...
  res.status(200).send(await conversationExtension.handleIncoming(req.body.text, req.body.user, 'mock-api'))
})
```
Now any POST request that comes in on the `/incoming` path will be sent through the conversation framework and augmented as needed. No need to manage the user's context, as that is handled by the framework.

**Now for the fun part**

Let's say that we want to allow a user to ask Watson to roll a dice. We've defined that dialog flow in Watson conversation. In order to request that this API is called, and then display the result, requires 2 dialog nodes. Recall that after an API call, the framework will always respond back to conversation, so these two nodes are executed without any input from the end user.

### Roll a Dice Example

Asking Watson to use our example dice roll API requires 2 dialog nodes.

<img src="https://raw.githubusercontent.com/pthoresen/conversation-extension-framework/master/doc/rollDice-flow.png" height="300px">

The first node will tell the framework to use the diceRoll API that we registered. The content of the node is shown below:

<img src="https://raw.githubusercontent.com/pthoresen/conversation-extension-framework/master/doc/rollDice-apiNode.png" height="400px">

When our framework sees the `output.apiCall` property, it will attempt to locate the api registered as 'diceRoll' and it will set the usePrivate flag to `true`

This will set `privateContext.diceRoll` to be a value between 1 and 6 based on our implementation. The application will then reply to Watson Conversation which triggers the next node, which reports the result of our dice roll.

<img src="https://raw.githubusercontent.com/pthoresen/conversation-extension-framework/master/doc/rollDice-resultsNode.png" height="400px">

The token `{{diceRoll}}` will be replaced with either `privateContext.diceRoll` or `context.diceRoll` in the `responseText` property

The final `responseText` will be *'You have rolled a 3. This was stored privately on the server.'*

### Storing a user response Example

Storing a user's next response as a context or privateContext field just takes 1 dialog node. In this example, we'll confirm that the value was stored with the second node.

<img src="https://raw.githubusercontent.com/pthoresen/conversation-extension-framework/master/doc/changeName-flow.png" height="300px">

The first node will need to inform the application that it will store the user's response in `privateContext.name`. To do this, we'll need to set the `output.updatesContext` propery.

<img src="https://raw.githubusercontent.com/pthoresen/conversation-extension-framework/master/doc/changeName-updateContextNode.png" height="400px">

This tells the application to store the next user response as `privateContext.name`. Had the ':private' suffix been omitted, it would have stored the response as `context.name`

Just as in the previous example, we can substitute the value into the response by using `{{name}}` token in our response.

<img src="https://raw.githubusercontent.com/pthoresen/conversation-extension-framework/master/doc/changeName-confirmNode.png" height="400px">


## Handling Mutiple Front Ends

Part of the power of this tool is the fact that it will apply the same logic regardless of the message source. This means the core conversation code needs to be developed in only one place and can be used by mulitple clients.

To achieve this, the message processing logic is separate from the code to receive and reply to messages. This means that one of the tasks as a developer using this tool is that the developer is responsible for ensuring that incoming messages are sent through the *handleIncoming* function of the **ConversationExtension** object.

Once a response has been received, the developer should format and reply to the user as appropriate for the incoming message source.

Separating the message processing logic from the mechanics of replying to a message also allows a developer to create special enhancements that may be appropriate for the incoming message source. For instance, if the client supports embedding media, it can be done at this point without having to include that in the core logic that governs all client responses.
