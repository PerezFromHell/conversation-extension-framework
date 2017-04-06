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
