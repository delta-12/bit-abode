import { Component } from "react"

export default class TableRow extends Component {

    render() {
        const device = this.props.device
        const date = new Date(device.dateConnected).toLocaleString()
        return (
            <tr className="table-default">
                <th scope="row">{device.UID}</th>
                <td>{device.name}</td>
                {
                    (device.status) ? <td className="text-success">Online</td> : <td className="text-danger">Offline</td>
                }
                <td>{date}</td>
                <td>{device.localNetwork}</td>
                <td>{device.localAddress}</td>
            </tr>
        )
    }

}