require('dotenv').config()
// mute console warnings
console.warn = () => {}
console.log = () => {}
console.error = () => {}

jasmine.getEnv().defaultTimeoutInterval = 10000
