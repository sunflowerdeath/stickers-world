import React from 'react'

import mixin from '@@/utils/mixin/decorator'
import StylesMixin from '@@/utils/stylesMixin'
import Logo from '@@/components/Logo'

@mixin(StylesMixin)
export default class LandscapeWarningView extends React.Component {
	static styles = {
		logo: {
			marginTop: 32,
			marginBottom: 32
		},
		message: {
			textAlign: 'center',
			color: 'white',
			fontSize: 14
		}
	}

	render() {
		return (
			<div style={this.styles.root}>
				<Logo style={this.styles.logo} />
				<div style={this.styles.message}>
					Please, turn your phone into lanscape orientation
				</div>
			</div>
		)
	}
}
