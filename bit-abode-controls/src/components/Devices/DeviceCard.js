import { Component } from "react"

export default class DeviceCard extends Component {

    render() {
      return (
        <div className={"card text-white " + this.props.bg + " mb-3"} style={{ maxWidth: "20rem" }}>
            <div className="card-header">{this.props.type}</div>
            <div className="card-body">
                <h4 className="card-title">{this.props.name}</h4>
                {this.props.content}
            </div>
        </div>     
      )
    }

  }