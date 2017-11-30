import React from 'react'

import Tappable from '@@/components/Tappable'

export default class AngleSlider extends React.Component {
	onTapStart() {
		this.initialValue = this.props.value
		this.props.onTapStart()
	}

	onTapMove({ dx }) {
		const width = this.dotsRef.clientWidth
		let value = this.initialValue + dx / width * 90
		value = Math.min(Math.max(value, -45), 45)
		if (value > -1 && value < 1) value = 0
		this.props.onChange(value)
	}

	onTapEnd() {
		if (this.props.onTapEnd) this.props.onTapEnd()
	}

	getStyles(props) {
		return {
			root: {
				paddingBottom: 15,
				paddingTop: 15,
				backdropFilter: 'blur(10px)',
				WebkitBackdropFilter: 'blur(10px)'
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
				background: 'white'
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
		const { value } = this.props
		const styles = this.getStyles(this.props)

		const dots = []
		for (let i = -45; i <= +45; i += 5) {
			dots.push(<div key={i} style={i === 0 ? styles.bar : styles.dot} />)
		}

		return (
			<Tappable
				style={styles.root}
				onTapStart={this.onTapStart.bind(this)}
				onTapMove={this.onTapMove.bind(this)}
				onTapEnd={this.onTapEnd.bind(this)}
			>
				<div style={styles.pointer} />
				<div
					style={styles.dots}
					ref={ref => {
						this.dotsRef = ref
					}}
				>
					{dots}
				</div>
				<div style={styles.value}>{Math.round(value)}°</div>
			</Tappable>
		)
	}
}
