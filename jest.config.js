const path = require('path')

module.exports = {
  transform: {
    '^.+\\.js$': path.join(__dirname, 'jest.transform.js')
  }
}
