const mongoose = require("mongoose")
const Schema = mongoose.Schema

const DeviceSchema =  new Schema({
    UID: {
        type: String,
        required: true,
        unique: true,
        trim: true
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
    }
})

module.exports = Device = mongoose.model("devices", DeviceSchema)