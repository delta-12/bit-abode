import { Component } from "react"
import { setAnalog } from "../Commands"

export default class Analog extends Component {

    state = {
        value: 0
    }

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
        let command = setAnalog
        command.command = e.target.value
        command.port = this.props.port
        command.uid = this.props.uid
        this.props.sendCommand(command)
    }

    render() {
        return (
            <div className="mb-2">
                <fieldset className="form-group">
                    <label className="text-success">Set analog signal (0 - 255)</label>
                    <input type="range" className="custom-range" min="0" max="255" onChange={this.onChange} id="value" />
                    <label className="text-success">Update Interval: {this.state.value}s</label>
                </fieldset>                
            </div>
        )
    }

}