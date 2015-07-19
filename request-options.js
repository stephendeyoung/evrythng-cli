var inquirer = require('inquirer')
var async = require('async')

module.exports = {
  projects: function (apiRequest, callback) {
    apiRequest('/projects', callback)
  },
  products: function (apiRequest, callback) {
    apiRequest('/products', callback)
  },
  thngs: function (apiRequest, callback) {
    apiRequest('/thngs', callback)
  },
  createProject: function (apiRequest, callback) {
    async.waterfall([
      function (cb) {
        inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Name of the project:'
          },
          {
            type: 'input',
            name: 'description',
            message: 'Description of the project'
          }
        ], cb.bind(null, null))
      },
      function (answers, cb) {
        apiRequest.post({
          url: '/projects',
          body: answers
        }, cb)
      }
    ], callback)
  }
}
