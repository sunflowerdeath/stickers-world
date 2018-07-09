import React from 'react'
import floral from 'floral'

import Logo from '@@/components/Logo'

const styles = {
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

const LandscapeWarningView = floral(styles)(({ computedStyles }) => (
	<div style={computedStyles.root}>
		<Logo style={computedStyles.logo} />
		<div style={computedStyles.message}>
			Please, turn your phone into lanscape orientation
		</div>
	</div>
))

export default LandscapeWarningView
