import React from 'react'
import floral from 'floral'

const styles = {
	root: {
		display: 'flex'
	}
}

const Tabs = floral(styles)(({ computedStyles, children, value, onChange }) => {
	const tabs = React.Children.map(children, child =>
		React.cloneElement(child, {
			isSelected: child.props.value === value,
			onSelect: () => onChange(child.props.value),
			key: child.props.value
		})
	)
	return <div style={computedStyles.root}>{tabs}</div>
})

export default Tabs
