import React from 'react'
import floral from 'floral'

const styles = {
	root: {
		fontFamily: 'Lobster, cursive',
		fontSize: 64,
		lineHeight: '0.9em',
		color: '#ddd',
		margin: 'auto',
		width: 250,
		textAlign: 'center',
		userSelect: 'none'
	}
}

const Logo = floral(styles)(({ computedStyles }) => (
	<div style={computedStyles.root}>Stickers world</div>
))

export default Logo
