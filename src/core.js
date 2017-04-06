/**
* @Date:   2017-04-03T12:00:38-05:00
 * @Last modified time: 2017-04-05T23:55:51-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/
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
