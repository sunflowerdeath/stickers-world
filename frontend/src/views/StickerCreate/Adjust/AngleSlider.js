import React, { Component } from 'react'
import PropTypes from 'prop-types'
import floral from 'floral'
import Taply from 'taply'

import bindMethods from '@@/utils/bindMethods'

@floral
@bindMethods('onTapStart', 'onTapMove', 'onTapEnd')
class AngleSlider extends Component {
	static propTypes = {
		value: PropTypes.number.isRequired,
		onRotateStart: PropTypes.func,
		onRotate: PropTypes.func,
		onRotateEnd: PropTypes.func
	}

	static styles = (props, state) => ({
		root: {
			cursor: state.isPressed ? 'move' : 'default'
		},
		pointer: {
			width: 10,
			height: 10,
			margin: 'auto',
			marginBottom: 5,
			background: 'white'
		},
		dots: {
			display: 'flex',
			margin: 'auto',
			height: 24,
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
			height: 24,
			borderRadius: 2,
			background: 'white'
		},
		value: {
			color: 'white',
			fontSize: 14,
			textAlign: 'center',
			lineHeight: '20px'
		}
	})

	state = {
		isPressed: false
	}

	onTapStart() {
		this.initialValue = this.props.value
		this.setState({ isPressed: true })
		if (this.props.onRotateStart) this.props.onRotateStart()
	}

	onTapMove(event, touches) {
		const { dx } = touches[0]
		const width = this.dotsRef.clientWidth
		let value = this.initialValue + dx / width * 90
		value = Math.min(Math.max(value, -45), 45)
		if (value > -1 && value < 1) value = 0
		this.props.onRotate(value)
	}

	onTapEnd() {
		this.setState({ isPressed: false })
		if (this.props.onRotateEnd) this.props.onRotateEnd()
	}

	render() {
		const { value } = this.props

		const dots = []
		for (let i = -45; i <= +45; i += 5) {
			dots.push(<div key={i} style={i === 0 ? this.styles.bar : this.styles.dot} />)
		}

		return (
			<Taply
				onTapStart={this.onTapStart}
				onTapMove={this.onTapMove}
				onTapEnd={this.onTapEnd}
			>
				<div style={this.styles.root}>
					<div style={this.styles.pointer} />
					<div
						style={this.styles.dots}
						ref={ref => {
							this.dotsRef = ref
						}}
					>
						{dots}
					</div>
					<div style={this.styles.value}>{Math.round(value)}°</div>
				</div>
			</Taply>
		)
	}
}

export default AngleSlider
