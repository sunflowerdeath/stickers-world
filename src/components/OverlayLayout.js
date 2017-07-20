import React from 'react'

export default class OverlayLayout extends React.Component {
	render() {
		let styles = {
			root: {
				backgroundColor: 'black',
				height: '100%'
			},
			top: {
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				zIndex: 1
			},
			bottom: {
				position: 'absolute',
				bottom: 0,
				left: 0,
				width: '100%',
				zIndex: 1
			}
		}

		let top, bottom
		if (this.props.top) top = <div style={styles.top}>{this.props.top}</div>
		if (this.props.bottom) bottom = <div style={styles.bottom}>{this.props.bottom}</div>

		return (
			<div style={styles.root}>
				{top}
				{bottom}
				{this.props.children}
			</div>
		)
	}
}
