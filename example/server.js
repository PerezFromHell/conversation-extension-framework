require('dotenv').config()
let express = require('express')
let bodyParser = require('body-parser')
let cfenv = require('cfenv')

// Load the Conversation Extension Class
// This is the important piece to using the framework. We need to initialize this object
// with our conversation credentials and then send any incoming messages through the
// handleIncoming function
let conversationExtension = new (require('../'))(process.env.CONVERSATION_API_URL, process.env.CONVERSATION_API_USER, process.env.CONVERSATION_API_PASSWORD)

// Here is where APIs are registered. When conversation responds with a value in
// output.apiCall with the format "callName:public" or "callName:private" or just "callName"
// it will attempt to match the API call requested to the registered API calls.
// In this case, to call the diceRoll API, we'll need conversation to respond with
// output.apiCall: "diceRoll" or output.apiCall: "diceRoll:public" or "output.apiCall: "diceRoll:private"

// Register the diceRoll API to 'diceRoll'
conversationExtension.addAPI('diceRoll', require('./api/diceRoll').rollDice)

// Register the timestamp middleware
conversationExtension.addPreMW(require('./middleware/timestamp').addTimestamp)

// Initialize express
let app = express()

// Parse POST bodies
app.use(bodyParser.json())

// Mock Incoming message
// body.text: message to send
// body.user: 'user' sending the message
app.post('/incoming', async (req, res, next) => {
  // Send the incoming message through the conversation extension framework

  // The framework will respond with {responseText, userData}.
  // userData is made up of:
  // {
  //  context: The context object directly from conversation,
  //  privateContext: The private context for this user and source from the app
  // }
  res.status(200).send(await conversationExtension.handleIncoming(req.body.text, req.body.user, 'mock-api'))

  // Ideally here you would do something relevant to your incoming message source
  // and not just reply with this data. For instance, if this was an incoming
  // Slack message, you would reply to the user via Slack
})

// Start the server
app.listen(cfenv.getAppEnv().port, '0.0.0.0', function () {
  console.log('Server Started on ' + cfenv.getAppEnv().port)
})

module.exports = app
