import React from 'react'

import OverlayLayout from '@@/components/OverlayLayout'
import TopBar from '@@/components/TopBar'
import Tappable from '@@/components/Tappable'
import Icon from '@@/components/Icon'

import AspectSwitcher from './AspectSwitcher'
import AngleSlider from './AngleSlider'

let arrowLeftIcon
let arrowRightIcon
import rotateIcon from '!raw-loader!@@/icons/rotate.svg'

import patrick from '!file-loader!@@/patrick.jpg'

const SCREEN_WIDTH = document.documentElement.clientWidth
const SCREEN_HEIGHT = document.documentElement.clientHeight
const TOP_BAR_HEIGHT = 50
const BOTTOM_PANEL_HEIGHT = 90

const getCropCorners = (crop, image) => ({
	tl: {
		point: { x: 0, y: 0 },
		constraint: { minX: 0, minY: 0 }
	},
	tr: {
		point: { x: 0, y: crop.width },
		constraint: { minX: 0, maxY: image.width }
	},
	bl: {
		point: { x: crop.height, y: 0 },
		constraint: { maxX: image.height, minY: 0 }
	},
	br: {
		point: { x: crop.height, y: crop.width },
		constraint: { maxX: image.height, maxY: image.width }
	}
})

const rotatePoint = (point, center, angle, delta) => {
	const { x, y } = point
	const { x: cx, y: cy } = center
	const { x: dx, y: dy } = delta
	const rad = -angle * Math.PI / 180
	const sin = Math.sin(rad)
	const cos = Math.cos(rad)
	return {
		x: dx + cx + (x - cx) * cos - (y - cy) * sin,
		y: dy + cy + (x - cx) * sin + (y - cy) * cos
	}
}

const checkConstraint = (point, constraint) => {
	const { x, y } = point
	const { minX, maxX, minY, maxY } = constraint
	if (minX !== undefined && x < minX) return false
	if (maxX !== undefined && x > maxX) return false
	if (minY !== undefined && y < minY) return false
	if (maxY !== undefined && y > maxY) return false
	return true
}

const constrainScale = (point, center, angle, delta, constraint) => {
	const { x, y } = point
	const { x: cx, y: cy } = center
	const { x: dx, y: dy } = delta
	const { minX, minY, maxX, maxY } = constraint
	const CX = minX === undefined ? maxX : minX
	const CY = minY === undefined ? maxY : minY
	const rad = -angle * Math.PI / 180
	const sin = Math.sin(rad)
	const cos = Math.cos(rad)

	// C = top - deltaTop + S * ( cx + (x - cx) * cos - (y - cy) * sin )
	// deltaTop = height * (S - 1) / 2 = S * cx - cx
	const xScale = (CX - dx - cx) / ((x - cx) * cos - (y - cy) * sin)

	// C = left - deltaLeft + S * ( cy + (x - cx) * sin + (y - cy) * cos )
	// deltaLeft = left * (S - 1) / 2 = S * cy - cy
	const yScale = (CY - dy - cy) / ((x - cx) * sin + (y - cy) * cos)

	return Math.min(xScale, yScale)
}

// @bindMethods('onRotate', 'onPanStart', 'onPanMove', 'onChangeOrientation')
export default class AdjustView extends React.Component {
	constructor(props) {
		super()

		const { width, height } = props

		this.state = {
			aspect: 'rect',
			crop: {
				top: 30,
				left: 30,
				width: width - 50,
				height: height - 50,
				angle: 0,
				scale: 1
			}
		}
	}

	// For given crop, calculate image transform, such that crop frame is positioned
	// at the center of the screen with equal margin to edges
	getStyles(crop) {
		const { width, height } = this.props

		const horizScale = (SCREEN_WIDTH - 20 * 2) / crop.width
		const vertScale =
			(SCREEN_HEIGHT - TOP_BAR_HEIGHT - BOTTOM_PANEL_HEIGHT - 20 * 2) / crop.height
		const scale = Math.min(horizScale, vertScale)

		const frameWidth = crop.width * scale
		const frameHeight = crop.height * scale
		const top = (SCREEN_HEIGHT - TOP_BAR_HEIGHT - frameHeight) / 2
		const left = (SCREEN_WIDTH - frameWidth) / 2

		const originTop = (crop.top + crop.height / 2) * scale
		const originLeft = (crop.left + crop.width / 2) * scale

		return {
			frame: {
				position: 'absolute',
				width: frameWidth,
				height: frameHeight,
				transform: [
					`translateY(${top}px)`,
					`translateX(${left}px)`,
					// `rotate(${crop.angle}deg)`,
					`scale(${crop.scale})`
				].join(' '),
				willChange: 'transform, width, height',
				border: '1px solid rgba(0,0,0,0.5)',
				background: 'rgba(0,0,0,0.4)',
				boxSizing: 'border-box',
				borderRadius: this.state.aspect === 'circle' ? '50%' : 0
			},
			image: {
				position: 'absolute',
				width: width * scale,
				height: height * scale,
				transform: [
					`translateY(${top - crop.top * scale}px)`,
					`translateX(${left - crop.left * scale}px)`,
					`rotate(${-crop.angle}deg)`
				].join(' '),
				transformOrigin: `${originLeft}px ${originTop}px`,
				willChange: 'transform, width, height',
				backgroundImage: `url(${patrick})`,
				backgroundSize: '100% 100%'
			}
		}
	}

	render() {
		const { width, height } = this.props
		const { crop } = this.state

		const topBar = (
			<TopBar
				leftIcon={<Icon icon={arrowLeftIcon} />}
				onTapLeftIcon={this.props.onGoBack}
				rightIcon={<Icon icon={arrowRightIcon} />}
				onTapRightIcon={this.props.onGoNext}
			>
				<div>Crop photo</div>
				<AspectSwitcher
					value={this.state.aspect}
					onChange={aspect => this.setState({ aspect })}
				/>
				<Tappable onTap={this.changeOrientation.bind(this)}>
					<Icon icon={rotateIcon} />
				</Tappable>
			</TopBar>
		)

		const angleSlider = (
			<AngleSlider value={crop.angle} onChange={this.onRotate.bind(this)} />
		)

		const container = {
			width: '100%',
			height: '100%',
			overflow: 'hidden',
			position: 'absolute'
		}

		const styles = this.getStyles(this.state.crop)

		return (
			<OverlayLayout top={topBar} bottom={angleSlider}>
				<Tappable
					onTapStart={this.onPanStart.bind(this)}
					onTapMove={this.onPanMove.bind(this)}
					style={container}
				>
					<div style={styles.image} />
					<div style={styles.frame} />
				</Tappable>
			</OverlayLayout>
		)
	}

	onPanStart() {
		this.initialCrop = this.state.crop
		// maxX, maxY
	}

	onPanMove({ dx, dy, event }) {
		const { left, top } = this.initialCrop
		this.setState({
			crop: {
				...this.state.crop,
				left: left - dx / 2, // TODO divide by scale
				top: top - dy / 2
			}
		})
	}

	changeOrientation() {
		const orientation = this.state.rotation === 270 ? 0 : this.state.rotation + 90
		this.setState({ orientation })
	}

	onRotate(angle) {
		const { width, height } = this.props
		const image = { width, height }
		const { crop } = this.state
		const corners = getCropCorners(crop, image)
		const center = { x: crop.height / 2, y: crop.width / 2 }
		const delta = { x: crop.top, y: crop.left }

		let scale = 1
		for (const i in corners) {
			const { point, constraint } = corners[i]
			const rotatedPoint = rotatePoint(point, center, angle, delta)
			if (!checkConstraint(rotatedPoint, constraint)) {
				const constrainedScale = constrainScale(
					point,
					center,
					angle,
					delta,
					constraint
				)
				if (constrainedScale < scale && constrainedScale > 0) {
					scale = constrainedScale
				}
			}
		}

		this.setState({
			crop: {
				...crop,
				angle,
				scale
			}
		})
	}
}
