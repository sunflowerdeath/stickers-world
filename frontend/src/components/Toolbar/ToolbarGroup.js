import React, { Component } from 'react'
import floral from 'floral'

@floral
class ToolbarGroup extends Component {
	static styles = ({ grow }) => ({
		root: {
			display: 'flex',
			alignItems: 'center',
			marginRight: 24,
			flexGrow: grow ? 1 : 0
		}
	})

	render() {
		return <div style={this.styles.root}>{this.props.children}</div>
	}
}

export default ToolbarGroup
