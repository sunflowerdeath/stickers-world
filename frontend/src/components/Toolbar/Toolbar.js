import React from 'react'
import floral from 'floral'

const styles = {
	root: {
		color: 'white',
		display: 'flex',
		justifyContent: 'space-between',
		padding: '0 24px',
		height: 48,
		alignItems: 'center'
	}
}

const Toolbar = floral(styles)(({ computedStyles, children }) => (
	<div style={computedStyles.root}>{children}</div>
))

export default Toolbar
