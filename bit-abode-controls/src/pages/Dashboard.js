import { Component } from "react"
import axios from "axios"
import Header from "../components/Header"
import ConnectModal from "../components/ConnectModal"
import ControllerStatusBox from "../components/ControllerStatusBox"
import Devices from "../components/Devices/Devices"
import {connect, sendMsg, disconnect} from "../components/Socket"
import { add_device, lightsOff, lightsOn } from "../components/Commands"
import InputError from "../components/InputError"

export default class Dashboard extends Component {
  
  intervalID

  state = {
    showModal: true,
    name: "",
    password: "",
    localNetwork: "",
    localAddress: "",
    dateConnected: "",
    devices:{},
    errors: {},
    devicesError: null,
    online: null,
    offline: null,
    socket: null,
    socketConnected: false,
    redbotConnected: false,
    activeKey: null,
    addDeviceResponse: null
  }

  initConnect = e => {
    e.preventDefault()
    this.disconnect()
    this.setState({ errors: {} })
    const controller = {
      name: this.state.name,
      password: this.state.password
    }
    axios.post("/api/controller/connect", controller)
      .then(res => {
        this.setState({
          localNetwork: res.data.localNetwork,
          localAddress: res.data.localAddress,
          dateConnected: res.data.dataConnected
        })
        connect(res.data.key, cb => {
            this.setState(cb)
            console.log(this.state)
          })
        this.toggleModal()
        this.getDevices()
      })
      .catch(err => {
        this.setState({
          errors: err.response.data
        })
      })
  }

  getDevices() {
    const controller = {
      name: this.state.name,
      password: this.state.password
    }
    axios.post("/api/devices/all", controller)
      .then(res => {
        this.setState({ devices: res.data.devices })
      })
      .catch(err => {
        this.setState({ devicesError: "Error getting devices. Try refreshing." })
      })
    this.intervalID = setTimeout(this.getDevices.bind(this), 5000)
  }

  showConnectModal = e => {
    this.onChange(e)
    this.toggleModal()
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal, errors: {} })
  }

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  toggleLocalControl = () => {
    this.setState({ localControl: !this.state.localControl })
  }

  disconnect = () => {
    if (this.state.socket !== null) {
      disconnect(this.state.socket)
      clearTimeout(this.intervalID)
    } else {
      console.log("Not connected to a socket")
    }
    this.setState({ activeKey: null })
  }

  sendCommand = command => {
    sendMsg(this.state.socket, JSON.stringify(command))
  }

  render() {
    return (
      <div>
        <Header />
        <ConnectModal show={this.state.showModal} onHide={this.toggleModal} errors={this.state.errors} onChange={this.onChange} name={this.state.name} passowrd={this.state.password} connect={this.initConnect} />
        <div className="container-fluid mt-5 pt-5">
          <ControllerStatusBox name={this.state.name} sendCommand={this.sendCommand} add_device={add_device} addDeviceResponse={this.state.addDeviceResponse} dashboardStatus={this.state.socketConnected} controllerStatus={this.state.redbotConnected} disconnect={this.disconnect} activeKey={this.state.activeKey} localNetwork={this.state.localNetwork} localAddress={this.state.localAddress} dataConnected={this.state.dateConnected} />
        </div>
        <div className="container-fluid d-flex">
          {
            (this.state.devicesError === null) ? <Devices devices={this.state.devices} /> : <InputError error={this.state.devicesError} />
          }
        </div>
      </div>
    )
  }

}