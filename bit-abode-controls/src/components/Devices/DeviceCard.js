import { Component } from "react"
import Digital from "./Digital"
import Analog from "./Analog"
import { remove_device } from "../Commands"

export default class DeviceCard extends Component {

  intervalID

  state = {
    bg: "",
    content: null
  }

  componentDidMount() {
    this.getType()
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID)
  }

  deleteDevice = () => {
    remove_device.data = {
      uid: this.props.uid
    }
    this.props.sendCommand(remove_device)
  }

  getType() {
    switch (this.props.type) {
      case "digital":
        this.setState({ bg: "bg-primary", content: <Digital sendCommand={this.props.sendCommand} uid={this.props.uid} port={this.props.port} state={this.props.state} /> })
        break
      case "analog":
        this.setState({ bg: "bg-primary", content: <Analog sendCommand={this.props.sendCommand} uid={this.props.uid} port={this.props.port} state={this.props.state} /> })
        break
      default:
        break
    }
    this.intervalID = setTimeout(this.getType.bind(this), 1000)
  }

  render() {
    return (
      <div className={"card text-white " + this.state.bg + " mb-3"} style={{ maxWidth: "20rem" }}>
          <div className="card-header">{"Type: " + this.props.type}</div>
          <div className="card-body">
              <h4 className="card-title">{this.props.name}</h4>
              <p className="card-text">Port: {this.props.port}</p>
              {this.state.content}
              <button className="btn btn-danger" onClick={this.deleteDevice}>Delete</button>
          </div>
      </div>     
    )
  }

  }