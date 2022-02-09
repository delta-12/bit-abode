const mongoose = require("mongoose")
const Schema = mongoose.Schema

const DeviceSchema =  new Schema({
    UID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    type: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    },
    controllerKey: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    controller: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String
    },
    dateConnected: {
        type: Date
    }
})

module.exports = Device = mongoose.model("devices", DeviceSchema)