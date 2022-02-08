let wheelCommand = {
    type: "wheel",
    command: {
        left: {
            direction: null,
            speed: null
        },
        right: {
            direction: null,
            speed: null
        }
    }
}

let forward = {
    type: "wheel",
    command: {
        left: {
            direction: 1,
            speed: 255
        },
        right: {
            direction: 1,
            speed: 255
        }
    }
}

let reverse = {
    type: "wheel",
    command: {
        left: {
            direction: 0,
            speed: 255
        },
        right: {
            direction: 0,
            speed: 255
        }
    }
}

let left = {
    type: "wheel",
    command: {
        left: {
            direction: 0,
            speed: 255
        },
        right: {
            direction: 1,
            speed: 255
        }
    }
}

let right = {
    type: "wheel",
    command: {
        left: {
            direction: 1,
            speed: 255
        },
        right: {
            direction: 0,
            speed: 255
        }
    }
}

let stop = {
    type: "wheel",
    command: {
        left: {
            direction: null,
            speed: 0
        },
        right: {
            direction: null,
            speed: 0
        }
    }
}

let brake = {
    type: "wheel",
    command: {
        left: {
            direction: 0,
            speed: 0
        },
        right: {
            direction: 0,
            speed: 0
        }
    }
}

export { wheelCommand, forward, reverse, left, right, stop, brake }