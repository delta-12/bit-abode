import { Component } from "react"
import DeviceCard from "./DeviceCard"

export default class Devices extends Component {

    render() {
        const devices = this.props.devices.map((d) => <DeviceCard key={d.UID} uid={d.UID} type={d.type} name={d.name} port={d.port} sendCommand={this.props.sendCommand} />)
        return (
            <main className="col-md-12 ml-sm-auto px-4 mt-5" >
                <div className="row gap-1">
                    {devices}
                </div>
          </main>
        )
    }

}