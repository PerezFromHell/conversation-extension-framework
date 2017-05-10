/**
 * addTimestamp - add a timestamp to context for last message sent
 *
 * @param  {object} context        user's context
 * @param  {object} privateContext user's private context
 * @param  {object} rawResponse the rawResponse from Watson Conversation (only applicable for post middleware)
 * @return {Promise}              {context, privateContext}
 */

// Important that these API connections return a Promise!
// This promise should promise to return an updated context and private context
let addTimestamp = function (context, privateContext, rawResponse) {
  return new Promise((resolve, reject) => {
    context.timestamp = new Date().toString()
    resolve({context, privateContext})
  })
}

module.exports = {
  addTimestamp
}
