const Validator = require("validator")
const isEmpty = require("is-empty")

module.exports = function validateDevice(data) {
    let errors = {}
  
    data.uid = !isEmpty(data.uid) ? data.uid : ""
    data.type = !isEmpty(data.type) ? data.type : ""
    data.port = !isEmpty(data.port) ? data.port : ""
    data.name = !isEmpty(data.name) ? data.name : ""
    data.controller = !isEmpty(data.controller) ? data.controller : ""
    data.controllerKey = !isEmpty(data.controller) ? data.controllerKey : ""

    if (Validator.isEmpty(data.uid)) {
        errors.uid = "UID field is required"
    }

    if (Validator.isEmpty(data.type)) {
        errors.type = "Type field is required"
    }

    if (Validator.isEmpty(data.port)) {
        errors.port = "Port field is required"
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required"
    }

    if (Validator.isEmpty(data.controller)) {
        errors.controller = "Controller field is required"
    }

    if (Validator.isEmpty(data.controllerKey)) {
        errors.controllerKey = "Controller Key field is required"
    }
  
    return {
      errors,
      isValid: isEmpty(errors)
    }
  }