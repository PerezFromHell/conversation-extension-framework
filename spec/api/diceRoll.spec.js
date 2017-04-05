/**
* @Date:   2017-03-21T21:21:54-05:00
* @Last modified time: 2017-04-04T12:33:57-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/

let diceRollAPI = require('../../example/api/diceRoll')

// Not a great way to test this always returns good values... but it's a mock API
describe('call to the mock diceRoll API', () => {
  let userContexts = {}
  beforeEach((done) => {
    diceRollAPI.rollDice(false, {}, {}).then((contexts) => {
      userContexts = contexts
      done()
    })
  })
  it('should store the result in context if usePrivate is false', () => {
    expect(userContexts.context.diceRoll).not.toBeLessThan(1)
    expect(userContexts.context.diceRoll).not.toBeGreaterThan(6)
  })
  it('should store the result in private context if usePrivate is true', () => {
    expect(userContexts.privateContext.diceRoll).not.toBeLessThan(1)
    expect(userContexts.privateContext.diceRoll).not.toBeGreaterThan(6)
  })
})
