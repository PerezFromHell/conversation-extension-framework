let middlewarePre = []
let middlewarePost = []

/**
 * executePre - executes all middleware before sending the user's response to
 *              Watson conversation
 *
 * @param  {object}  context public context for the user
 * @param  {object}  privateContext private context for the user
 * @return {object}  An object containing updated contexts (if needed)
 *                  {
 *                    context: updated context
 *                    privateContext: updated private context
 *                  }
 */
let executePre = async (context, privateContext) => {
  for (let i = 0; i < middlewarePre.length; i++) {
    ({context, privateContext} = await middlewarePre[i](context, privateContext, {}))
  }
  return {context, privateContext}
}

/**
 * executePost - executes all middleware after sending the user's response to
 *              Watson conversation
 *
 * @param  {object}  context public context for the user
 * @param  {object}  privateContext private context for the user
 * @param  {object}  rawResponse rawResponse from previous call to Watson Conversation
 * @return {object}  An object containing updated contexts (if needed)
 *                  {
 *                    context: updated context
 *                    privateContext: updated private context
 *                  }
 */
let executePost = async (context, privateContext, rawResponse) => {
  for (let i = 0; i < middlewarePost.length; i++) {
    ({context, privateContext} = await middlewarePost[i](context, privateContext, rawResponse))
  }
  return {context, privateContext}
}

/**
 * addPreMW - adds a middleware function to be executed before sending a message
 *            to Watson Conversation
 *
  * @param  {function}  mwFunction a function containing the following signature
  *                     function (context, privateContext) {}
  *                     returns: {promise} to resolve {context, privateContext}
  * @return {object}  An object containing updated contexts (if needed)
 */
let addPreMW = (mwFunction) => {
  if (typeof mwFunction !== 'function') {
    console.error('unable to add middleware function to pre. Verify that it is a function that returns a promise.')
    throw new Error('Invalid argument supplied to addPreMW function')
  }
  middlewarePre.push(mwFunction)
}

/**
 * addPreMW - adds a middleware function to be executed before sending a message
 *            to Watson Conversation
 *
  * @param  {function}  mwFunction a function containing the following signature
  *                     function (context, privateContext, rawResponse) {}
  *                     returns: {promise} to resolve {context, privateContext}
  * @return {object}  An object containing updated contexts (if needed)
 */
let addPostMW = (mwFunction) => {
  if (typeof mwFunction !== 'function') {
    console.error('unable to add middleware function to post. Verify that it is a function that returns a promise.')
    throw new Error('Invalid argument supplied to addPostMW function')
  }
  middlewarePost.push(mwFunction)
}

module.exports = {
  executePre,
  executePost,
  addPreMW,
  addPostMW
}
