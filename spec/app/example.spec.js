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
    expect(body.conversationResponse).toBeDefined()
    expect(body.conversationResponse).toEqual(jasmine.any(Object))
  })
})
