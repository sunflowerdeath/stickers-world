import React from 'react'
import floral from 'floral'

const styles = {
	root: {
		fontWeight: 500,
		textTransform: 'uppercase',
		marginRight: 24
	}
}
const ToolbarCaption = floral(styles)(({ computedStyles, children }) => (
	<div style={computedStyles.root}>{children}</div>
))

export default ToolbarCaption
