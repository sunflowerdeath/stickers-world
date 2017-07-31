import React from 'react'

export default class TopBar extends React.Component {
	render() {
		let styles = {
			root: {
				height: 50,
				paddingLeft: 20,
				paddingRight: 20,
				color: 'white',
				backgroundColor: 'rgba(0,0,0,0.5)',
				fontSize: 18,
				display: 'flex',
				alignItems: 'center',
				flexShrink: 0,
				backdropFilter: 'blur(10px)',
				WebkitBackdropFilter: 'blur(10px)'
			}
		}
		return (
			<div style={styles.root}>
				{this.props.children}
			</div>
		)
	}
}
