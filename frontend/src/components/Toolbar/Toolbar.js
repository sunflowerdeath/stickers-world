import React, { Component } from 'react'
import floral from 'floral'

@floral
class Toolbar extends Component {
	static styles = {
		root: {
			color: 'white',
			display: 'flex',
			justifyContent: 'space-between',
			padding: '0 24px',
			height: 48,
			alignItems: 'center'
		}
	}

	render() {
		return <div style={this.styles.root}>{this.props.children}</div>
	}
}

export default Toolbar
