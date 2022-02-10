const express = require("express")
const bcrypt = require("bcryptjs")
const Controller = require("../../models/Controller")
const validateController = require("../../validation/controller")
const validateConnection = require("../../validation/connection")

const router = express.Router()

router.post("/addController", (req, res) => {
    const { errors, isValid } = validateController(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    Controller.findOne({ name: req.body.name }).then(controller => {
        if (controller) {
            return res.status(400).json({ name: "Duplicate Name"})
        }
        const newController = new Controller({
            name: req.body.name,
            localNetwork: req.body.localNetwork,
            localAddress: req.body.localAddress,
            key: req.body.key
        })
        switch (req.body.status) {
            case "0":
                newController.status = false
                break
            case "1":
                newController.status = true
                break
            default:
                return res.status(400).json({ status: "No status provided"})
        }
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) throw err
                newController.password = hash
                newController.dateConnected = new Date().getTime()
                newController
                    .save()
                    .then(controller => res.status(200).json(controller))
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ addController: "Failed to add Controller" })
                    })
            })
        })
    })
})

router.post("/removeController", (req, res) => {
    const { errors, isValid } = validateConnection(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    Controller.findOne({ name: req.body.name }).then(controller => {
        if (!controller) {
            return res.status(400).json({ auth: "Incorrect Name or Password" })
        }
        bcrypt.compare(req.body.password, controller.password).then(isMatch => {
            if (isMatch) {
                Controller.deleteOne({ name: req.body.name })
                    .then(() => {
                        return res.status(200).json({ deleted: true })
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(500).json({ deleted: false })
                    })
            } else {
                return res.status(400).json({ auth: "Incorrect Name or Password" })
            }
        })
    })
})

router.post("/connect", (req, res) => {
    const { errors, isValid } = validateConnection(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    const password = req.body.password
    Controller.findOne({ name: req.body.name }).then(controller => {
        if (!controller) {
            return res.status(400).json({ auth: "Incorrect Name or Password" })
        }
        bcrypt.compare(password, controller.password).then(isMatch => {
            if (isMatch) {
                return res.status(200).json(controller)
            } else {
                return res.status(400).json({ auth: "Incorrect Name or Password" })
            }
        })
    })
})

router.post("/changeControllerStatus", (req, res) => {
    const { errors, isValid } = validateController(req.body)
    if (!isValid) {
        return res.status(400).json(errors)
    }
    Controller.findOne({ name: req.body.name }).then(controller => {
        if (!controller) {
            return res.status(400).json({ auth: "Incorrect Name or Password" })
        }
        bcrypt.compare(req.body.password, controller.password).then(isMatch => {
            if (isMatch) {
                controller.name = req.body.name
                controller.localNetwork = req.body.localNetwork
                controller.localAddress = req.body.localAddress
                controller.key = req.body.key
                switch (req.body.status) {
                    case "0":
                        controller.status = false
                        break
                    case "1":
                        controller.status = true
                        break
                    default:
                        return res.status(400).json({ status: "No status provided"})
                }
                controller
                    .save()
                    .then(() => res.status(200).json(controller))
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ status: "Unable to toggle status"})
                    })
            } else {
                return res.status(400).json({ auth: "Incorrect Name or Password" })
            }
        })
    })
})

module.exports = router