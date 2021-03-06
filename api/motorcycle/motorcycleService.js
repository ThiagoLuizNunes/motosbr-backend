const _ = require('lodash')
const Motorcycle = require('./motorcycle')
// const data = require('./data')

// require('./insertData')(data, Motorcycle)
//Create REST API, adds CRUD to Mongog's schema
Motorcycle.methods(['get', 'post', 'put', 'delete'])

//Return post/put methods updated
Motorcycle.updateOptions({new: true, runValidators: true})

//Middleware to intercept post/put methods
Motorcycle.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)

/*
 * Standardizing errors handling
*/
function sendErrorsOrNext (req, res, next) {
  const bundle = res.locals.bundle

  if (bundle.errors) {
    var errors = parseErrors(bundle.errors)
    res.status(500).json({errors})
  }
  else {
    next()
  }
}
function parseErrors (nodeRestfulErrors) {
  const errors = []
  _.forIn(nodeRestfulErrors, error => errors.push(error.message))
  return errors
}

//Adds rout for return numbers of records in collection
Motorcycle.route('count', function (req, res, next) {
  //MongoDB's count method
  Motorcycle.count(function (error, value) {
    if (error) {
      res.status(500).json({errors: [error]})
    } else {
      res.json({value})
    }
  })
})

Motorcycle.route('count-brands', function (req, res, next) {
  Motorcycle.find({}, 'brand', (err, motorcycle) => {
    if (err) {
      return handleError(err)
    }
    else {
      let arr = []
      for (var i = 0; i < motorcycle.length; i++) {
        if (!findArray(motorcycle[i].brand, arr)) {
          arr.push(motorcycle[i].brand)
        }
      }
      res.json({value : arr.length})
    }
  })
})

function findArray(element, array) {
  let bol = false
  for (let i = 0; i < array.length; i++) {
    if (element === array[i]) {
      return true
    }
  }
  return false
}

module.exports = Motorcycle
