import { Component } from "react"
import classnames from "classnames"
import { alarmOn, alarmOff } from "../Commands"

export default class Alarm extends Component {

    onClick = () => {
        let command = (this.props.state) ? alarmOff : alarmOn
        command.port = this.props.port
        command.uid = this.props.uid
        this.props.sendCommand(command)
    }

    render() {
        return (
            <div className="mb-2">
                <p className="card-text">State: {this.props.state}</p>
                <button className={classnames((this.props.state) ? "btn btn-dark" : "btn btn-light")} onClick={this.onClick}>{(this.props.state === "On") ? "Turn Off" : "Turn On"}</button>
            </div>
        )
    }

}