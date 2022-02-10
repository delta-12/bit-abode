import { Component } from "react"
import axios from "axios"
import TableRow from "./TableRow"

export default class Table extends Component {

    intervalID

    state = {
        devices: null,
        errors: {}
    }

    componentDidMount() {
        this.getDevices()
    }

    componentWillUnmount() {
        clearTimeout(this.intervalID)
    }

    getRedbots() {
        axios.get("/api/devices/all")
            .then(res => {
                this.setState({
                    devices: res.data.all
                })
            })
            .catch(err => {
                this.setState({
                    errors: err.response.data
                })
            })
        this.intervalID = setTimeout(this.getRedbots.bind(this), 5000)
    }

    render() {
        let devices
        if (this.state.devices !== null && this.state.devices !== 0) {
            devices = this.state.devices.map((device) => <TableRow key={device._id} device={device} />)
        }
        return (
            <table className="table table-hover">
                <thead>
                    <tr>
                    <th scope="col">UID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date Connected</th>
                    <th scope="col">Local Network</th>
                    <th scope="col">Local Address</th>
                    <th></th>
                    </tr>
                </thead>
                <tbody>
                    {devices}
                </tbody>
            </table>
        )
    }

}