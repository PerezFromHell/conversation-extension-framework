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
