import React, { Component } from 'react'
import floral from 'floral'

@floral
class ToolbarCaption extends Component {
	static styles = {
		root: {
			fontWeight: 500,
			textTransform: 'uppercase',
			marginRight: 24
		}
	}

	render() {
		return <div style={this.styles.root}>{this.props.children}</div>
	}
}

export default ToolbarCaption
