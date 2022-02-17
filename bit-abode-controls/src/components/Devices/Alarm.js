import { Component } from "react"
import classnames from "classnames"
import { digitalOff, digitalOn, setAlarm } from "../Commands"

export default class Alarm extends Component {

    state = {
        time: ""
    }

    onChange = e => {
        this.setState({
          [e.target.id]: e.target.value
        })
      }

    onClick = () => {
        let command = (this.props.state === "On") ? digitalOff : digitalOn
        command.port = this.props.port
        command.uid = this.props.uid
        this.props.sendCommand(command)
    }

    onSetClick = () => {
        let command = setAlarm
        command.port = this.props.port
        command.uid = this.props.uid
        command.set_time = this.state.time
        this.props.sendCommand(command)
    }

    render() {
        return (
            <div className="mb-2">
                <p className="card-text">State: {this.props.state}</p>
                <button className={classnames((this.props.state  === "On") ? "btn btn-dark" : "btn btn-light")} onClick={this.onClick}>{(this.props.state === "On") ? "Turn Off" : "Turn On"}</button>
                <input type="text" className="form-control" placeholder="00:00" id="time" onChange={this.onChange} value={this.state.time} />
                <button className="btn btn-outline-success" onClick={this.onSetClick}>Set Alarm Time</button>
            </div>
        )
    }

}