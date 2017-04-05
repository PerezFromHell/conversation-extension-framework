/**
 * @Date:   2017-04-03T11:37:10-05:00
 * @Last modified time: 2017-04-04T23:05:16-05:00
 * @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

 * @Copyright: Copyright 2017 IBM Corp. All Rights Reserved.
 */

let request = require('request')
/*
function genericRequestPromise (options) {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error || Number(response.statusCode) > 400) {
        console.log(error || 'status code: ' + response.statusCode)
        reject(error)
      }
      resolve(JSON.parse(body))
    })
  })
}
*/

function genericRequestRawPromise (options) {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        console.log(error)
        reject(error)
      }
      resolve(body)
    })
  })
}

module.exports = {
  // genericRequestPromise,
  genericRequestRawPromise
}
