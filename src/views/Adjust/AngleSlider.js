import React from 'react'

import Tappable from '@@/components/Tappable'

export default class AngleSlider extends React.Component {
	getStyles(props) {
		return {
			root: {
				paddingBottom: 15,
				paddingTop: 15,
				background: 'rgba(0,0,0,0.5)'
			},
			pointer: {
				width: 10,
				height: 10,
				margin: 'auto',
				marginBottom: 10,
				background: 'white'
			},
			dots: {
				display: 'flex',
				margin: 'auto',
				height: 30,
				alignItems: 'center',
				marginRight: 30,
				marginLeft: 30,
				justifyContent: 'space-between',
				marginBottom: 5,
				transform: `translateX(${props.value / 90 * 100}%`,
				willChange: 'transform'
			},
			dot: {
				width: 2,
				height: 2,
				background: 'white',
				borderRadius: 2
			},
			bar: {
				width: 2,
				height: 30,
				borderRadius: 2,
				background: 'white',
			},
			value: {
				color: 'white',
				fontSize: 14,
				textAlign: 'center',
				lineHeight: '20px'
			}
		}
	}

	render() {
		let {value} = this.props

		let styles = this.getStyles(this.props)

		let dots = []
		for (let i = -45; i <= +45; i +=5) {
			dots.push(<div style={i === 0 ? styles.bar : styles.dot} />)
		}

		return (
			<Tappable
				style={styles.root}
				onTapStart={this.onTapStart.bind(this)}
				onTapMove={this.onTapMove.bind(this)}
			>
				<div style={styles.pointer}/>
				<div style={styles.dots} ref={(ref) => this.dotsRef = ref}>
					{dots}
				</div>
				<div style={styles.value}>
					{Math.round(value)}°
				</div>
			</Tappable>
		)
	}

	onTapStart({x}) {
		this.initialValue = this.props.value
	}

	onTapMove({dx}) {
		const width = this.dotsRef.clientWidth
		let value = this.initialValue + dx / width * 90
		value = Math.min(Math.max(value, -45), 45)
		if (value > -1 && value < 1) value = 0
		this.props.onChange(value)
	}
}
