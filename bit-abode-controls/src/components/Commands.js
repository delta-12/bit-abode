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
    command: 0
}

let lightsOn = {
    type: "lights",
    port: "",
    command: 1
}

export { add_device, remove_device, lightsOff, lightsOn }