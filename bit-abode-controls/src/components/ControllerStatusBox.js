import { Component } from "react"
import AddDeviceModal from "./AddDeviceModal"

export default class ControllerStatusBox extends Component {

    state = {
        showAddDeviceModal: false,
        type: "",
        port: "",
        name: "",
        success: this.props.addDeviceResponse
    }

    toggleModal = () => {
        this.setState({ showAddDeviceModal: !this.state.showAddDeviceModal })
    }

    onChange = e => {
        this.setState({
          [e.target.id]: e.target.value
        })
      }

    addDevice = e => {
        e.preventDefault()
        this.setState({ errors: {} })
        let device = this.props.add_device
        device.data = {
            name: this.state.name,
            type: this.state.type,
            port: this.state.port
        }
        this.props.sendCommand(device)
    }
    
    render() {
        // const date = new Date(this.props.dateConnected).toLocaleString()
        return (
            <div className="p-3">
                <AddDeviceModal show={this.state.showAddDeviceModal} onHide={this.toggleModal} onChange={this.onChange} name={this.state.name} type={this.state.type} port={this.state.port} addDevice={this.addDevice} success={this.state.success} />
                <div className="d-flex col-12 justify-content-between align-items-center p-3 border-bottom">
                    <h3>{this.props.name}</h3>
                    <div className="d-flex">
                        {(this.props.dashboardStatus) ? <button className="btn btn-outline-dark mx-2" onClick={this.toggleModal}>Add Device</button> : null}
                        {(this.props.dashboardStatus) ? <button className="btn btn-primary" onClick={this.props.disconnect}>Disconnect</button> : null}
                    </div>
                </div>
                <div className="d-grid col-12 justify-content-between align-items-center p-3 border-bottom">
                    <div className="col-12">
                        <p>{(this.props.dashboardStatus) ? <span className="text-success">&#10004;</span> : <span className="text-danger">&#10006;</span>}  Dashboard Connected</p>
                        <p>{(this.props.controllerStatus) ? <span className="text-success">&#10004;</span> : <span className="text-danger">&#10006;</span>}  Controller Connected</p>
                        {/* <p><strong>Local Network (LAN): </strong>{this.props.localNetwork}</p> */}
                        <p><strong>Local Address: </strong>{this.props.localAddress}</p>
                        {/* <p><strong>Devices: </strong>{this.props.deviceNum}</p>
                        <p><strong>Ports in Use: </strong></p>
                        <p><strong>Available Ports: </strong></p>
                        <p><strong>Data Connected: </strong>{date}</p> */}
                    </div>
                </div>
            </div>
        )
    }
    
}
