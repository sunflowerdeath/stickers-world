import React from 'react'
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

const styles = () => ({
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

const BackgroundSwitcher = floral(styles)(({ value, computedStyles, onChange }) => {
	const items = Object.entries(BACKGROUNDS).map(([key, background]) => {
		const style = {
			...computedStyles.item,
			...(value === key && computedStyles.isSelected),
			...background
		}
		return (
			<Taply key={key} onTap={() => onChange(key)}>
				<div style={style} />
			</Taply>
		)
	})
	return <div style={computedStyles.root}>{items}</div>
})

BackgroundSwitcher.propTypes = {
	value: PropTypes.oneOf(['white', 'black', 'checkers', 'photo']).isRequired,
	onChange: PropTypes.func.isRequried
}

export default BackgroundSwitcher
