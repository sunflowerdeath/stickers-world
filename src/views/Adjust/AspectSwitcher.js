import React from 'react'

export default class AspectSwitcher extends React.Component {
	getStyles(props) {
		let root = {
			display: 'flex'
		}

		let selected = {
			background: 'white'
		}

		let unselected = {
			boxSizing: 'border-box',
			borderWidth: 2,
			borderColor: 'white'
		}

		let aspects = {
			rect: {
				width: 24,
				height: 18,
				borderRadius: 3,
				marginRight: 3
			}
			square: {
				height: 18,
				width: 18,
				borderRadius: 3,
				marginRight: 3
			}
			circle: {
				height: 18,
				width: 18,
				borderRadius: 9
			}
		}

		for (let i in aspects) {
			Object.assign(aspects[i], props.value === i ? selected : unselected)
		}

		let bar = {
			width: 2,
			height: 25,
			borderRadius: 2,
			background: 'white',
			marginRight: 3
		}

		return {root, ...aspects, bar}
	}
		

	render() {
		let styles = this.getStyles(this.props)

		return (
			<div style={styles.root} onClick={this.props.onClick.bind(this)}>
				<div style={styles.rect} />
				<div style={styles.bar} />
				<div style={styles.square} />
				<div style={styles.bar} />
				<div style={styles.circle} />
			</div>
		)
	}

	onClick() {
		let {value} = this.props
		let aspect
		if (value === 'free') {
			aspect = 'square'
		} else if (value === 'square') {
			aspect = 'circle'
		} else if (value === 'circle') {
			aspect = 'free'
		}
		this.onChange(value)
	}
}


