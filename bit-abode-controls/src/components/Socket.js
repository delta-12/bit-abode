let connect = (key, cb) => {
  console.log("Attempting Connection...")
  // let socket = new WebSocket("ws://localhost:10801")
  let socket = new WebSocket("wss://bit-abode-iot-server.herokuapp.com")
  socket.onopen = () => {
    console.log("Successfully Connected")
    cb({ socket: socket, socketConnected: true })
    let connectMsg = { type: "init", connect: key }
    socket.send(JSON.stringify(connectMsg))
    let checkConnectedMsg = { type: "checkConnected"}
    socket.send(JSON.stringify(checkConnectedMsg))
  }

  socket.onmessage = msg => {
    let msgJSON = JSON.parse(msg.data)
    console.log(msgJSON)
    switch (msgJSON.type) {
      case "checkConnected":
        cb({ controllerConnected: msgJSON.status })
        if (msgJSON.status === false) {
          disconnect(socket)
        }
        break
      case "add_device":
        if (msgJSON.id === 2) {
          cb({ addDeviceResponse: msgJSON.response })
        }
        break
      default:
        break
    }
  }

  socket.onclose = event => {
    console.log("Socket Closed Connection: ", event)
    cb({ socket: null, socketConnected: false, controllerConnected: false, showModal: true, name: "", password: "", errors: {}, devicesError: null })
  }

  socket.onerror = error => {
    console.log("Socket Error: ", error)
  }
}

let disconnect = socket => {
  console.log("Attempting Disconnect...")
  socket.close()
}

let sendMsg = (socket, msg) => {
  console.log("sending msg: ", msg)
  socket.send(msg)
}

export { connect, sendMsg, disconnect }