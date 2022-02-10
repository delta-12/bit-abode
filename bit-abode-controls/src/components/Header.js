import { Component } from "react"
import { Link } from "react-router-dom"

export default class Header extends Component {

	render() {
		return (
			<nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
				<div className="container-fluid">
					<Link style={{ textDecoration: "none" }} to="/"><div className="navbar-brand">Bit Abode v1.0.0</div></Link>
				</div>
				<div className="navbar-brand">{this.props.activePage}</div>
			</nav>
		)
	}

}