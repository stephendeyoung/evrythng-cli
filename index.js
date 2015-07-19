var inquirer = require('inquirer')
var async = require('async')
var prettyjson = require('prettyjson')
var colors = require('colors')

var apiRequest = require('./api-request')
var requestOptions = require('./request-options')

process.stdout.write('Welcome to the Evrythng command line CLI. To begin please provide us with your API key.\n')

login()

function login () {
  async.auto({
    apiKeyAnswer: function (callback) {
      inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: 'API Key:'
        }
      ], callback.bind(null, null))
    },
    testApiKey: ['apiKeyAnswer', function (callback, results) {
      apiRequest(
        '/thngs',
        {
          headers: {
            Authorization: results.apiKeyAnswer.apiKey
          }
        },
        callback
      )
    }],
    setDefaultApiRequest: ['testApiKey', function (callback, results) {
      if (results.testApiKey[0].statusCode !== 200) return callback(new Error('You\'ve provided an invalid API Key. Please try again.'))
      callback()
    }]
  }, function (err, results) {
    if (err) {
      console.error(err)
      return login()
    }

    apiRequest = apiRequest.defaults({
      headers: {
        Authorization: results.apiKeyAnswer.apiKey
      }
    })
    showRequestOptions()
  })
}

function showRequestOptions () {
  async.waterfall([
    function (callback) {
      inquirer.prompt([
        {
          type: 'list',
          name: 'option',
          message: 'What would you like to do?',
          choices: [
            {
              name: 'Show me a list of my projects',
              value: 'projects'
            },
            {
              name: 'Show me a list of my products',
              value: 'products'
            },
            {
              name: 'Show me a list of my thngs',
              value: 'thngs'
            },
            {
              name: 'Create a new project',
              value: 'createProject'
            }
          ]
        }
      ], callback.bind(null, null))
    },
    function (answers, callback) {
      requestOptions[answers.option](apiRequest, callback)
    }
  ], function (err, res, body) {
    if (err) return console.error(err)
    if (res.statusCode > 299) {
      console.error(colors.red('Sorry there was an error completing your request: %s'), body.errors)
      return showRequestOptions()
    }

    console.log(prettyjson.render(body))
    showRequestOptions()
  })
}
