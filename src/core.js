let handler = require('./process-handler/process')

class conversationExtension {
  constructor (conversationUrl, conversationUser, conversationPassword) {
    this.handler = handler
    this.options = {
      conversationUrl: conversationUrl,
      conversationUser: conversationUser,
      conversationPassword: conversationPassword
    }
  }
  addAPI (apiCallName, apiCallPromise) {
    this.handler.apiCallDirector.addAPI(apiCallName, apiCallPromise)
  }
  async handleIncoming (incomingMessageText, userId, source) {
    try {
      return (await this.handler.processMessage(incomingMessageText, userId, source, this.options))
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

module.exports = conversationExtension
