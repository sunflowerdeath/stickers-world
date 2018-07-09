import React from 'react'
import PropTypes from 'prop-types'
import floral from 'floral'
import Taply from 'taply'

import SvgIcon from '@@/components/SvgIcon'

const styles = ({ size, fill }) => ({
	root: {
		transition: 'background 0.25s',
		flexShrink: 0,
		outline: 'none',
		fill,
		...(size === 'big'
			? { width: 48, height: 48, padding: 0, margin: 0 }
			: { width: 24, height: 24, padding: 12, margin: '0 -12px' })
	}
})

const IconButton = ({ svg, onTap, computedStyles }) => (
	<Taply onTap={onTap}>
		<SvgIcon svg={svg} style={computedStyles.root} />
	</Taply>
)

IconButton.defaultProps = {
	size: 'default'
}

IconButton.propTypes = {
	svg: PropTypes.string.isRequired,
	onTap: PropTypes.func,
	size: PropTypes.oneOf(['default', 'big'])
}

export default floral(styles)(IconButton)
