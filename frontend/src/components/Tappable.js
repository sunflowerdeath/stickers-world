import React from 'react'

export default class Tappable extends React.Component {
	render() {
		return (
			<div
				onClick={this.props.onTap}
				onTouchStart={this.onTouchStart.bind(this)}
				onTouchEnd={this.onTouchEnd.bind(this)}
				onTouchMove={this.onTouchMove.bind(this)}
				style={this.props.style}
			>
				{this.props.children}
			</div>
		)
	}

	onTouchStart(e) {
		let touch = e.touches[0]
		this.initial = {
			x: touch.clientX,
			y: touch.clientY
		}

		if (this.props.onTapStart) {
			this.props.onTapStart({
				...this.initial,
				event: e
			})
		}
	}

	onTouchMove(e) {
		if (this.props.onTapMove) {
			let touch = e.touches[0]
			let x = touch.clientX
			let y = touch.clientY
			this.props.onTapMove({
				x,
				y,
				dx: x - this.initial.x,
				dy: y - this.initial.y,
				event: e
			})
		}
	}

	onTouchEnd(e) {
		if (this.props.onTapEnd) {
			this.props.onTapEnd({
				event: e
			})
		}
	}
}
