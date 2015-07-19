
var request = require('request')

module.exports = request.defaults({
  baseUrl: 'https://api.evrythng.com/',
  json: true
})
