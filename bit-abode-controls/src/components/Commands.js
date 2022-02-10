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

let lightsOff = {
    type: "lights",
    port: "",
    id: 0,
    command: 0
}

let lightsOn = {
    type: "lights",
    port: "",
    id: 0,
    command: 1
}

let alarmOff = {
    type: "alarm",
    port: "",
    id: 0,
    command: 0
}

let alarmOn = {
    type: "alarm",
    port: "",
    id: 0,
    command: 1
}

let setAlarm = {
    type: "alarm",
    port: "",
    id: 0,
    command: 1,
    set_time: ""
}

export { add_device, remove_device, lightsOff, lightsOn, alarmOff, alarmOn, setAlarm }