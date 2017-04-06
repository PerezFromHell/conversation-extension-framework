describe('Verify Watson Conversaion integration', () => {
  let sendMessageToConversation = require('../../src/utils/conversation').sendMessageToConversation
  let watsonConversationResults = null
  beforeAll(async(done) => {
    if (watsonConversationResults) {
      done()
    } else {
      watsonConversationResults = await sendMessageToConversation('Hello', {}, process.env.CONVERSATION_API_URL, process.env.CONVERSATION_API_USER, process.env.CONVERSATION_API_PASSWORD)
      done()
    }
  })
  it('receives a response from Watson Conversation', () => {
    expect(watsonConversationResults).toBeDefined()
  })
  it('receives a good response from Watson Conversation', () => {
    expect(watsonConversationResults.output).toBeDefined()
    expect(watsonConversationResults.context).toBeDefined()
    expect(watsonConversationResults.input).toBeDefined()
  })
  it('receives an output from Watson Conversation', () => {
    expect(watsonConversationResults).toBeDefined()
  })
})
