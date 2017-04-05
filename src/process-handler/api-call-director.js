/**
* @Date:   2017-03-19T20:34:15-05:00
<<<<<<< HEAD
* @Last modified time: 2017-04-04T18:06:18-05:00
=======
* @Last modified time: 2017-04-04T18:06:18-05:00
>>>>>>> feature-better-api-plugin-management
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/

let apiCallIndex = {}

/**
 * direct - Make a call to an API as directed by the process orchestrator
 *
 * @param  {string}  apiCall Name of the API call to make.
 * @param  {boolean} usePrivate use public or private context as data source
 * @param  {object}  context public context for the user
 * @param  {object}  privateContext private  context for the uesr
 * @return {object}  An object containing updated contexts (if needed)
 *                  {
 *                    context: updated context
 *                    privateContext: updated private context
 *                  }
 */
let direct = async function (apiCall, usePrivate, context, privateContext) {
  try {
    let results = await apiCallIndex[apiCall](usePrivate, context, privateContext)
    context = results.context
    privateContext = results.privateContext
  } catch (err) {
    console.error('unable to make "' + apiCall + '" API call. ensure that the name is registered correctly in the API director and the API calls are defined properly')
  }

  return {context, privateContext}
}

/**
 * addAPI - Register an API call with the call director
 *
 * @param  {string} apiCallName Name for the API call director to match
 * @param  {function} apiCallPromise Function that returns a promise to update context and privateContext
 * @return {void} Registers the API call function
 */
function addAPI (apiCallName, apiCallPromise) {
  apiCallIndex[apiCallName] = apiCallPromise
}

module.exports = {
  direct,
  apiCallIndex,
  addAPI
}
