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
      await director.direct('diceRoll', true, {public: 'public'}, {private: 'private'}, {raw: 'raw'})
      done()
    })
    it('by verifying that the function is called', () => {
      expect(director.apiCallIndex.diceRoll).toHaveBeenCalled()
    })
    it('by verifying that the function is called with the right values', () => {
      expect(director.apiCallIndex.diceRoll.calls.mostRecent().args).toEqual([true, {public: 'public'}, {private: 'private'}, {raw: 'raw'}])
    })
  })
})
