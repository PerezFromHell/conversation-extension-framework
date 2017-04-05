/**
* @Date:   2017-03-16T23:40:36-05:00
* @Last modified time: 2017-04-04T12:52:42-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/

describe('Verify Watson Conversaion integration', () => {
  let sendMessageToConversation = require('../../src/utils/conversation').sendMessageToConversation
  let watsonConversationResults = null
  beforeAll(async(done) => {
    if (watsonConversationResults) {
      done()
    } else {
      watsonConversationResults = await sendMessageToConversation('Hello', {}, process.env.CONVERSATION_API_URL, process.env.CONVERSATION_API_USER, process.env.CONVERSATION_API_PASSWORD)
      done()
    }
  })
  it('receives a response from Watson Conversation', () => {
    expect(watsonConversationResults).toBeDefined()
  })
  it('receives a good response from Watson Conversation', () => {
    expect(watsonConversationResults.output).toBeDefined()
    expect(watsonConversationResults.context).toBeDefined()
    expect(watsonConversationResults.input).toBeDefined()
  })
  it('receives an output from Watson Conversation', () => {
    expect(watsonConversationResults).toBeDefined()
  })
})
