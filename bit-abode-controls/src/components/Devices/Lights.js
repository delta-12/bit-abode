import { Component } from "react"
import classnames from "classnames"
import { lightsOn, lightsOff } from "../Commands"

export default class Lights extends Component {

    onClick = () => {
        let command = (this.props.state) ? lightsOff : lightsOn
        command.port = this.props.port
        this.props.sendCommand(command)
    }

    render() {
        return (
            <div className="mb-2">
                <p className="card-text">State: {(this.props.state) ? "On" : "Off"}</p>
                <button className={classnames((this.props.state) ? "btn btn-dark" : "btn btn-light")} onClick={this.onClick}>{(this.props.state) ? "Turn Off" : "Turn On"}</button>
            </div>
        )
    }

}