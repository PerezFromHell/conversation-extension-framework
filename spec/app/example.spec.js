/**
 * @Date:   2017-04-05T12:40:55-05:00
 * @Last modified time: 2017-04-05T12:56:56-05:00
 * @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

 * @Copyright: Copyright 2017 IBM Corp. All Rights Reserved.
 */

let request = require('supertest')

describe('Example App', () => {
  let app = require('../../example/server')
  let body = {}
  beforeAll(async (done) => {
    body = (await request(app).post('/incoming').send({text: 'hello', user: 'jasmine'})).body
    done()
  })
  it ('expects a properly formed response', () => {
    expect(body).toBeDefined()
    expect(body.responseText).toEqual(jasmine.any(String))
    expect(body.userData).toBeDefined()
    expect(body.userData).toEqual(jasmine.any(Object))
    expect(body.userData.context).toBeDefined()
    expect(body.userData.context).toEqual(jasmine.any(Object))
    expect(body.userData.privateContext).toBeDefined()
    expect(body.userData.privateContext).toEqual(jasmine.any(Object))
  })
})
