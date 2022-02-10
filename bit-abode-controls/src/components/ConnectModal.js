import { Component } from "react"
import Modal from "react-bootstrap/Modal"
import classnames from "classnames"
import InputError from "./InputError"

export default class ConnectModal extends Component {

    render() {
        const errors = this.props.errors
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} centered>
                <Modal.Header>
                    <Modal.Title>Connect to Controller</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="d-grid gap-1 form-group">
                    <input type="text" className={classnames((errors.auth !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.auth })} placeholder="Name" id="name" onChange={this.props.onChange} value={this.props.name} />
                    <InputError error={errors.auth || errors.name } />
                    <input type="password" className={classnames((errors.auth !== undefined) ? "form-control is-invalid" : "form-control", { invalid: errors.auth })} placeholder="Password" id="password" onChange={this.props.onChange} value={this.props.password} />
                    <InputError error={errors.auth || errors.password} />
                </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.props.connect}>Connect</button>
                </Modal.Footer>
            </Modal>
        )
    }

}