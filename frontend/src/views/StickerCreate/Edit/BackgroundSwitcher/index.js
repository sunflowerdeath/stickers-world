import React, { Component } from 'react'
import PropTypes from 'prop-types'
import floral from 'floral'
import Taply from 'taply'

import photo from './photo.jpg'
import checkers from './checkers.svg'

const BACKGROUNDS = {
	black: {
		backgroundColor: 'black'
	},
	white: {
		backgroundColor: 'white'
	},
	chekers: {
		backgroundColor: 'white',
		backgroundImage: `url(${checkers})`,
		backgroundSize: '100%'
	},
	photo: {
		backgroundImage: `url(${photo})`
	}
}

@floral
class BackgroundSwitcher extends Component {
	static propTypes = {
		value: PropTypes.oneOf(['white', 'black', 'checkers', 'photo']).isRequired,
		onChange: PropTypes.func.isRequried
	}

	static styles = () => ({
		root: {
			display: 'flex'
		},
		item: {
			width: 24,
			height: 24,
			border: '2px solid #ccc',
			borderRadius: 2,
			boxSizing: 'border-box',
			marginRight: 8
		},
		isSelected: {
			border: '2px solid white'
		}
	})

	render() {
		const { value } = this.props
		const items = Object.entries(BACKGROUNDS).map(([key, background]) => {
			const style = {
				...this.styles.item,
				...(value === key && this.styles.isSelected),
				...background
			}
			return (
				<Taply key={key} onTap={() => this.props.onChange(key)}>
					<div style={style} />
				</Taply>
			)
		})
		return <div style={this.styles.root}>{items}</div>
	}
}

export default BackgroundSwitcher
