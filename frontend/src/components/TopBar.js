import React from 'react'

import styledComponent from '@@/utils/styledComponent'
import Tappable from '@@/components/Tappable'

@styledComponent
export default class TopBar extends React.Component {
	static styles(props) {
		let root = {
			height: 64,
			paddingLeft: 24,
			paddingRight: 24,
			color: 'white',
			backgroundColor: 'rgba(0,0,0,0.5)',
			display: 'flex',
			alignItems: 'center',
			flexShrink: 0,
			backdropFilter: 'blur(10px)',
			WebkitBackdropFilter: 'blur(10px)'
		}

		let title = {
			fontSize: 20,
			fontWeight: 500,
			flexGrow: 1
		}

		let icon = {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: 48,
			height: 48
		}

		let leftIcon
		if (props.leftIcon) {
			leftIcon = {
				...icon,
				marginRight: 8,
				marginLeft: -16,
			}
		}

		let rightIcon
		if (props.rightIcon) {
			rightIcon = {
				...icon,
				marginLeft: 8,
				marginRight: -16
			}
		}

		return {root, title, leftIcon, rightIcon}
	}

	render() {
		let leftIcon
		if (this.props.leftIcon) {
			leftIcon = <div style={this.styles.leftIcon}>{this.props.leftIcon}</div>
		}
		let rightIcon
		if (this.props.rightIcon) {
			rightIcon = <div style={this.styles.rightIcon}>{this.props.rightIcon}</div>
		}

		return (
			<div style={this.styles.root}>
				{leftIcon}
				<div style={this.styles.title}>{this.props.children}</div>
				{rightIcon}
			</div>
		)
	}
}
