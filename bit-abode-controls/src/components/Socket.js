let connect = (key, cb) => {
  console.log("Attempting Connection...")
  let socket = new WebSocket("wss://redbot-c2-server.herokuapp.com")
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
      // case 0:
      //   cb({ wheels: msgJSON.info })
      //   break
      case "checkConnected":
        cb({ redbotConnected: msgJSON.status })
        if(msgJSON.status === false) {
          disconnect(socket)
        }
        break;
      default:
        break
    }
  }

  socket.onclose = event => {
    console.log("Socket Closed Connection: ", event)
    cb({ socket: null, socketConnected: false, redbotConnected: false })
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