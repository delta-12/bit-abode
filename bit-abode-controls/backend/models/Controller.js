const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ControllerSchema =  new Schema({
    name : {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    status: {
        type: Boolean,
        required: true
    },
    localNetwork: {
        type: String
    },
    localAddress: {
        type: String
    },
    dateConnected: {
        type: Date
    },
    key: {
        type: String
    }
})

module.exports = Controller = mongoose.model("controllers", ControllerSchema)