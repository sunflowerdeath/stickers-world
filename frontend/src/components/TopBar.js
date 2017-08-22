import React from 'react'

import mixin from '@@/utils/mixin/decorator'
import StylesMixin from '@@/utils/stylesMixin'
import Tappable from '@@/components/Tappable'

@mixin(StylesMixin)
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
			fontWeight: 500
		}

		let leftIcon
		if (props.leftIcon) {
			leftIcon = {
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				marginRight: 8,
				marginLeft: -16,
				width: 48,
				height: 48
			}
		}

		return {root, title, leftIcon}
	}

	render() {
		let leftIcon
		if (this.props.leftIcon) {
			leftIcon = (
				<Tappable style={this.styles.leftIcon}>
					{this.props.leftIcon}
				</Tappable>
			)
		}

		return (
			<div style={this.styles.root}>
				{leftIcon}
				<div style={this.styles.title}>{this.props.children}</div>
			</div>
		)
	}
}
