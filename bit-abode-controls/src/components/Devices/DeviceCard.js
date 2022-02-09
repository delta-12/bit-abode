import { Component } from "react"
import { remove_device } from "../Commands"

export default class DeviceCard extends Component {

    deleteDevice = () => {
      remove_device.data = {
        uid: this.props.uid
      }
      this.props.sendCommand(remove_device)
    }

    render() {
      return (
        <div className={"card text-white " + this.props.bg + " mb-3"} style={{ maxWidth: "20rem" }}>
            <div className="card-header">{"Type: " + this.props.type}</div>
            <div className="card-body">
                <h4 className="card-title">{this.props.name}</h4>
                <p className="card-text">Port: {this.props.port}</p>
                {this.props.content}
                <button className="btn btn-danger" onClick={this.deleteDevice}>Delete</button>
            </div>
        </div>     
      )
    }

  }