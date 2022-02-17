import { Component } from "react"
import { setAnalog } from "../Commands"

export default class Analog extends Component {

    intervalID

    state = {
        value: 0,
        preValue: 0,
        count: 0
    }

    componentDidMount() {
        setTimeout(() => {
            this.sendCmd()
        }, 5000)
    }
    
    componentWillUnmount() {
        clearTimeout(this.intervalID)
    }

    sendCmd() {
        if (this.state.count < 3) {
            let command = setAnalog
            command.command = this.state.value
            command.port = this.props.port
            command.uid = this.props.uid
            this.props.sendCommand(command)
            this.setState({
                preValue: this.state.value,
                count: this.state.count+1
            })
        } else {
            if (this.state.preValue !== this.state.value)
            {
                this.setState({ count: 0 })
            }
        }
        this.intervalID = setTimeout(this.sendCmd.bind(this), 1000)
    }

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    render() {
        return (
            <div className="mb-2">
                <fieldset className="form-group">
                    <label className="text-success">Set analog signal (0 - 255)</label>
                    <input type="range" className="custom-range" min="0" max="255" onChange={this.onChange} id="value" />
                    <br></br>
                    <label className="text-success">Current Signal: {this.state.value}</label>
                </fieldset>                
            </div>
        )
    }

}