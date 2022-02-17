let add_device = {
    type: "add_device",
    id: 0,
    data: {}
}

let remove_device = {
    type: "remove_device",
    id: 0,
    data: {}
}

let digitalOff = {
    type: "digital",
    command: 0
}

let digitalOn = {
    type: "digital",
    command: 1
}

let setAnalog = {
    type: "analog",
    command: 0
}

let setAlarm = {
    type: "set_alarm",
    command: 1
}

export { add_device, remove_device, digitalOn, digitalOff, setAnalog, setAlarm }