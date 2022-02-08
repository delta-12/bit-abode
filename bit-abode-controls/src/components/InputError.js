import { Component } from "react"

export default class InputError extends Component {

    render() {
        return (
            <small className="form-text text-danger mb-2">{this.props.error}</small>
        )
    }

}