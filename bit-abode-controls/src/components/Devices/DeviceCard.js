import { Component } from "react"
import Lights from "./Lights"
import Alarm from "./Alarm"
import { remove_device } from "../Commands"

export default class DeviceCard extends Component {

  state = {
    bg: "",
    content: null
  }

  componentDidMount() {
    this.getType()
  }

  deleteDevice = () => {
    remove_device.data = {
      uid: this.props.uid
    }
    this.props.sendCommand(remove_device)
  }

  getType() {
    switch (this.props.type) {
      case "lights":
        this.setState({ bg: "bg-primary", content: <Lights sendCommand={this.props.sendCommand} uid={this.props.uid} port={this.props.port} /> })
        break
      case "alarm":
        this.setState({ bg: "bg-info", content: <Alarm sendCommand={this.props.sendCommand} uid={this.props.uid} port={this.props.port} /> })
        break
      default:
        break
    }
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