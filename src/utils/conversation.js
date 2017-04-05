/**
* @Date:   2017-04-03T11:37:10-05:00
* @Last modified time: 2017-04-04T12:23:20-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/

let genericRequestRawPromise = require('./api').genericRequestRawPromise

/**
 * sendMessageToConversation - Make an HTTP request to send a message to Watson Conversation
 *
 * @param  {string} message               message to send
 * @param  {object} context               context object
 * @param  {string} conversationUrl       conversation API endpoint
 * @param  {string} conversationUser      conversation user
 * @param  {string} conversationPassword  conversation password
 * @return {Promise}                      a promise to make an HTTP call to Watson Conversation
 */
let sendMessageToConversation = function (message, context, conversationUrl, conversationUser, conversationPassword) {
  return genericRequestRawPromise({
    url: conversationUrl,
    method: 'POST',
    json: true,
    auth: {
      username: conversationUser,
      password: conversationPassword
    },
    body: {
      input: {
        text: message
      },
      context: context
    }
  })
}

module.exports = {
  sendMessageToConversation
}
