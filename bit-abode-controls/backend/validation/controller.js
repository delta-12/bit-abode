const Validator = require("validator")
const isEmpty = require("is-empty")

module.exports = function validateRedbot(data) {
    let errors = {}
  
    data.name = !isEmpty(data.name) ? data.name : ""
    data.password = !isEmpty(data.password) ? data.password : ""
    data.status = !isEmpty(data.status) ? data.status : ""

    if (Validator.isEmpty(data.name)) {
      errors.name = "Name field is required"
    }

    if (Validator.isEmpty(data.password)) {
      errors.password = "Password field is required"
    }
    if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
      errors.password = "Password must be at least 8 characters"
    }

    if (Validator.isEmpty(data.status)) {
      errors.status = "Status field is required"
    }
  
    return {
      errors,
      isValid: isEmpty(errors)
    }
  }