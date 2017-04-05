/**
* @Date:   2017-03-19T21:39:52-05:00
* @Last modified time: 2017-04-04T11:13:24-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/

/**
 * storeUserData - Stores user data to memory
 *
 * @param  {string} userId          user id to uniquely identify user data
 * @param  {string} source          source client for incoming message
 * @param  {object} context         public context to store
 * @param  {object} privateContext  private context to store
 * @param  {object} responseOptions response options to store
 * @return {void}                   Void. Stores to memory
 */
let storeUserData = function (userId, source, context, privateContext, responseOptions) {
  let userData = {
    context: context,
    privateContext: privateContext,
    responseOptions: responseOptions
  }
  if (!global.userData) {
    global.userData = {}
  }
  global.userData[source + '-' + userId] = userData
}

/**
 * retrieveUserData - Retrieves the user data from memory
 *
 * @param  {string} userId user id to uniquely identify user data
 * @param  {string} source source client for incoming message
 * @return {object}      user data {context, private context, responseOptions}
 */
let retrieveUserData = function (userId, source) {
  if (!global.userData || !global.userData[source + '-' + userId]) {
    return {
      context: {},
      privateContext: {},
      responseOptions: {}
    }
  }
  return global.userData[source + '-' + userId]
}

/**
 * augmentResponse - augments a response with values from the private context or
 *                   context
 *
 * @param  {string} text           text to augment
 * @param  {object} context        public context
 * @param  {object} privateContext private context
 * @return {string}                augmented text
 */
let augmentResponse = function (text, context, privateContext) {
  let matches = text.match(/{{.*?}}/g)
  for (let match of (matches || [])) {
    let name = match.replace(/({{|}})/g, '')
    if (privateContext[name]) {
      text = text.replace(match, privateContext[name])
    } else if (context[name]) {
      text = text.replace(match, context[name])
    } else {
      text = text.replace(match, '**VALUENOTFOUND**')
    }
  }
  return text
}
module.exports = { storeUserData, retrieveUserData, augmentResponse }
