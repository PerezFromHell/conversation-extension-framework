let ConversationExtension = require('../../src/core')
let conversationExtensionInstance = new ConversationExtension(process.env.CONVERSATION_API_URL, process.env.CONVERSATION_API_USER, process.env.CONVERSATION_API_PASSWORD)
describe('testing registration of invalid API call', () => {
  it('should throw an error', () => {
    expect(() => {
      conversationExtensionInstance.addAPI('diceRoll', 'NOT A FUNCTION')
    }).toThrow(new Error('Invalid argument supplied to addAPI function'))
  })
})
