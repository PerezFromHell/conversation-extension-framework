/**
 * @Date:   2017-04-05T18:28:18-05:00
 * @Last modified time: 2017-04-05T18:41:12-05:00
 * @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

 * @Copyright: Copyright 2017 IBM Corp. All Rights Reserved.
 */

let genericRequestRawPromise = require('../../src/utils/api').genericRequestRawPromise

describe('generic request wrapper', () => {
  describe('works as expected for a sucessful request', () => {
    let response = {}
    beforeAll(async(done) => {
      try {
        response = await genericRequestRawPromise({url: 'http://www.ibm.com', method: 'GET'})
      } catch (e) {
        response = 'ERROR'
      }
      done()
    })
    it('should have received a response', () => {
      expect(response).toBeDefined()
      expect(response).not.toBe('ERROR')
    })
  })
  describe('works as expected for a unsucessful request', () => {
    let response = {}
    beforeAll(async(done) => {
      try {
        response = await genericRequestRawPromise({url: 'INVALIDURL', method: 'GET'})
      } catch (e) {
        response = 'ERROR'
      }
      done()
    })
    it('should have received a response', () => {
      expect(response).toBeDefined()
      expect(response).toBe('ERROR')
    })
  })
})
