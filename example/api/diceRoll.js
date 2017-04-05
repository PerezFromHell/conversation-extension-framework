/**
* @Date:   2017-03-21T21:11:26-05:00
* @Last modified time: 2017-03-22T00:07:27-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/

/**
 * rollDice - rolls a d6
 *            demo 'mock' API for testing the application
 *
 * @param  {boolean} usePrivate  standard use private
 * @param  {object} context        user's context
 * @param  {object} privateContext user's private context
 * @return {Promise}              {context, privateContext}
 */

// Example API connection that returns a random dice roll after a short delay.
// Important that these API connections return a Promise!
let rollDice = function (usePrivate, context, privateContext) {
  return rollPromise().then((roll) => {
    if (usePrivate) {
      privateContext.diceRoll = roll
    } else {
      context.diceRoll = roll
    }
    return ({context, privateContext})
  }, (error) => {
    console.error(error)
    return error
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
