import React from 'react'
import floral from 'floral'

const styles = ({ grow }) => ({
	root: {
		display: 'flex',
		alignItems: 'center',
		marginRight: 24,
		flexGrow: grow ? 1 : 0
	}
})

const ToolbarGroup = floral(styles)(({ computedStyles, children }) => (
	<div style={computedStyles.root}>{children}</div>
))

export default ToolbarGroup
