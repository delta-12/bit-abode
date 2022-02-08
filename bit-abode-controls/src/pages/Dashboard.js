import { Component } from "react"
import axios from "axios"
import Header from "../components/Header"
// import Table from "../components/Table/Table"
import ConnectModal from "../components/ConnectModal"
import {connect, sendMsg, disconnect} from "../components/Socket"

export default class C2Server extends Component {

  state = {
    showModal: true,
    name: "",
    password: "",
    localNetwork: "",
    localAddress: "",
    dateConnected: "",
    errors: {},
    online: null,
    offline: null,
    socket: null,
    socketConnected: false,
    redbotConnected: false,
    activeKey: null
  }

  initConnect = e => {
    e.preventDefault()
    this.disconnect()
    this.setState({ errors: {} })
    const redbot = {
      name: this.state.name,
      password: this.state.password
    }
    axios.post("/api/controller/connect", redbot)
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
      })
      .catch(err => {
        this.setState({
          errors: err.response.data
        })
      })
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
      this.setState({ showModal: true })
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
        <Header activePage="C2 Server" />
        <ConnectModal show={this.state.showModal} onHide={this.toggleModal} errors={this.state.errors} onChange={this.onChange} name={this.state.name} passowrd={this.state.password} connect={this.initConnect} />
        <div className="container-flname mt-5 pt-5">
          {/* <Table connect={this.showConnectModal} />           */}
        </div>
      </div>
    )
  }

}