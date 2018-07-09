import React from 'react'

import Tappable from '@@/components/Tappable'

export default class AspectSwitcher extends React.Component {
	onTap() {
		let {value} = this.props
		let aspect
		if (value === 'rect') {
			aspect = 'square'
		} else if (value === 'square') {
			aspect = 'circle'
		} else if (value === 'circle') {
			aspect = 'rect'
		}
		this.props.onChange(aspect)
	}

	getStyles(props) {
		const root = {
			display: 'flex',
			alignItems: 'center'
		}

		const selected = {
			background: 'white'
		}

		const unselected = {
			boxSizing: 'border-box',
			border: '2px solid white'
		}

		const aspects = {
			rect: {
				width: 24,
				height: 18,
				borderRadius: 3,
				marginRight: 3
			},
			square: {
				height: 18,
				width: 18,
				borderRadius: 3,
				marginRight: 3
			},
			circle: {
				height: 18,
				width: 18,
				borderRadius: 9
			}
		}

		for (let i in aspects) {
			Object.assign(aspects[i], props.value === i ? selected : unselected)
		}

		const bar = {
			width: 2,
			height: 25,
			borderRadius: 2,
			background: 'white',
			marginRight: 3
		}

		return {root, ...aspects, bar}
	}

	render() {
		const styles = this.getStyles(this.props)

		return (
			<Tappable style={styles.root} onTap={this.onTap.bind(this)}>
				<div style={styles.rect} />
				<div style={styles.bar} />
				<div style={styles.square} />
				<div style={styles.bar} />
				<div style={styles.circle} />
			</Tappable>
		)
	}
}
