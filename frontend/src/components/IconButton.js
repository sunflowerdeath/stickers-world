import React, { Component } from 'react'
import PropTypes from 'prop-types'
import floral from 'floral'
import Taply from 'taply'

import SvgIcon from '@@/components/SvgIcon'

@floral
class IconButton extends Component {
	static defaultProps = {
		size: 'default'
	}

	static propTypes = {
		svg: PropTypes.string,
		onTap: PropTypes.func,
		size: PropTypes.oneOf(['default', 'big'])
	}

	static styles = ({ size, fill }) => ({
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

	render() {
		const { svg, onTap } = this.props
		return (
			<Taply onTap={onTap}>
				<SvgIcon svg={svg} style={this.styles.root} />
			</Taply>
		)
	}
}

export default IconButton
