import React from 'react'
import floral from 'floral'

import Tappable from '@@/components/Tappable'

const styles = props => ({
	root: {
		boxSizing: 'border-box',
		marginRight: 24,
		marginBottom: 24,
		width: this.props.size,
		height: this.props.size,
		background: `url(${props.url})`,
		backgroundSize: 'cover',
		borderRadius: 5
	}
})

const Photo = floral(styles)(({ computedStyles, onTap }) => (
	<Tappable onTap={onTap} style={computedStyles.root} />
))

export default Photo
