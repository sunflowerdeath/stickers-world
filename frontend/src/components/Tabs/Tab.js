import React from 'react'
import floral from 'floral'

const styles = ({ isSelected }) => ({
	root: {
		cursor: 'pointer',
		flexGrow: 1,
		flexBasis: 0,
		background: 'black',
		color: isSelected ? 'white' : 'rgba(255,255,255,0.44)',
		height: 48,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontWeight: 500,
		textTransform: 'uppercase'
	}
})

const Tab = floral(styles)(({ computedStyles, onSelect, children }) => (
	<div style={computedStyles.root} onClick={onSelect}>
		{children}
	</div>
))

export default Tab
