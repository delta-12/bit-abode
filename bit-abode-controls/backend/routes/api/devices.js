const express = require("express")
const bcrypt = require("bcryptjs")
const Controller = require("../../models/Controller")
const Device = require("../../models/Device")
const validateDevice = require("../../validation/device")
const validateConnection = require("../../validation/connection")

const router = express.Router()

router.post("/addDevice", (req, res) => {
    const { errors, isValid } = validateDevice(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    Device.findOne({ UID: req.body.uid }).then(device => {
        if (device) {
            return res.status(400).json({ name: "Duplicate UID"})
        }
        let newDevice = new Device({
            UID: req.body.uid,
            type: req.body.type,
            port: req.body.port,
            name: req.body.name,
            controller: req.body.controller,
            state: req.body.state,
            dateConnected: new Date().getTime()
        })
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.controllerKey, salt, (err, hash) => {
                if (err) throw err
                newDevice.controllerKey = hash
                newDevice
                    .save()
                    .then(device => res.status(200).json(device))
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ addDevice: "Failed to add device" })
                    })
            })
        })
    })
})

router.post("/removeDevice", (req, res) => {
    Device.findOne({ UID: req.body.uid }).then(device => {
        if (!device) {
            return res.status(400).json({ auth: "Incorrect UID or Controller Key" })
        }
        bcrypt.compare(req.body.controllerKey, device.controllerKey).then(isMatch => {
            if (isMatch) {
                Device.deleteOne({ UID: req.body.uid })
                    .then(() => {
                        return res.status(200).json({ deleted: true })
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(500).json({ deleted: false })
                    })
            } else {
                return res.status(400).json({ auth: "Incorrect UID or Controller Key" })
            }
        })
    })
})

router.post("/all", (req, res) => {
    const { errors, isValid } = validateConnection(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    Controller.findOne({ name: req.body.name }).then(controller => {
        if (!controller) {
            return res.status(400).json({ auth: "Incorrect Controller or Password" })
        }
        bcrypt.compare(req.body.password, controller.password).then(isMatch => {
            if (isMatch) {
                Device.find({ controller: controller.name })
                    .then(deviceList => {
                        return res.status(200).json({ devices: deviceList })
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(500).json({ error: "Failed to find devices" })
                    })
            } else {
                return res.status(400).json({ auth: "Incorrect Controller or Password" })
            }
        })
    })
})

router.post("/changeDeviceState", (req, res) => {
    Device.findOne({ UID: req.body.uid }).then(device => {
        if (!device) {
            return res.status(400).json({ auth: "Incorrect UID or Contoller Key" })
        }
        bcrypt.compare(req.body.controllerKey, device.controllerKey).then(isMatch => {
            if (isMatch) {
                device.state = req.body.state
                device
                    .save()
                    .then(() => res.status(200).json(device))
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ status: "Unable to set device state"})
                    })
            } else {
                return res.status(400).json({ auth: "Incorrect UID or Controller Key" })
            }
        })
    })
})

module.exports = router