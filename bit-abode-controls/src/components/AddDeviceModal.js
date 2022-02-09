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
                    <input type="text" className="form-control" placeholder="Type" id="type" onChange={this.props.onChange} value={this.props.type} />
                    <input type="text" className="form-control" placeholder="Port" id="port" onChange={this.props.onChange} value={this.props.port} />
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