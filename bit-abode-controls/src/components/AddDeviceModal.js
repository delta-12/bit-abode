import { Component } from "react"
import Modal from "react-bootstrap/Modal"
import InputError from "./InputError"

export default class AddDeviceModal extends Component {

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Device to Controller</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="d-grid gap-1 form-group">
                    <input type="text" className="form-control" placeholder="Name" id="name" onChange={this.props.onChange} value={this.props.name} />
                    <select className="form-control" onChange={this.props.onChange} value={this.props.type} id="type">
                        <option value="" disabled defaultValue>Select type</option>
                        <option value="lights">Lights</option>
                        <option value="alarm">Alarm</option>
                        <option value="temperature">Temperature</option>
                        <option value="thermostat">Thermostat</option>
                    </select>
                    <select className="form-control" onChange={this.props.onChange} value={this.props.port} id="port">
                        <option value="" disabled defaultValue>Select port</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                        <option value={6}>6</option>
                    </select>
                    {
                        (this.props.success) ? <small className="form-text text-success mb-2">Successfully added device.</small> :
                            (this.props.success === false) ? <InputError error="Failed to add device." /> : null
                    }
                </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.props.addDevice}>Add Device</button>
                </Modal.Footer>
            </Modal>
        )
    }

}