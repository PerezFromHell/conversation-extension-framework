/**
* @Date:   2017-03-21T21:30:33-05:00
* @Last modified time: 2017-04-04T12:33:52-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/

describe('Make calls to the API Director', () => {
  let director = require('../../src/process-handler/api-call-director')
  let diceRoll = require('../../example/api/diceRoll')

  // Add Dice Roll to the API Director
  director.addAPI('diceRoll', diceRoll.rollDice)

  describe('and test the diceRoll Mock API', () => {
    beforeAll(async (done) => {
      spyOn(director.apiCallIndex, 'diceRoll').and.callFake(() => {
        return new Promise((resolve, reject) => {
          resolve({context: {public: 'public'}, privateContext: {private: 'private'}})
        })
      })
      await director.direct('diceRoll', true, {public: 'public'}, {private: 'private'})
      done()
    })
    it('by verifying that the function is called', () => {
      expect(director.apiCallIndex.diceRoll).toHaveBeenCalled()
    })
    it('by verifying that the function is called with the right values', () => {
      expect(director.apiCallIndex.diceRoll.calls.mostRecent().args).toEqual([true, {public: 'public'}, {private: 'private'}])
    })
  })
})
