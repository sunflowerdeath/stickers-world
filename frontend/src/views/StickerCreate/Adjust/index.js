import React from 'react'
import PropTypes from 'prop-types'
import mapValues from 'lodash/mapValues'
import floral from 'floral'

import OverlayLayout from '@@/components/OverlayLayout'
import TopBar from '@@/components/TopBar'
import Tappable from '@@/components/Tappable'
import Icon from '@@/components/Icon'

import AspectSwitcher from './AspectSwitcher'
import AngleSlider from './AngleSlider'

let arrowLeftIcon
let arrowRightIcon
import rotateIcon from '!raw-loader!@@/icons/rotate.svg'

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
	return !(
		(minX !== undefined && x < minX) ||
		(maxX !== undefined && x > maxX) ||
		(minY !== undefined && y < minY) ||
		(maxY !== undefined && y > maxY)
	)
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

const constrainPosition = (crop, image) => {
	const center = { x: crop.height / 2, y: crop.width / 2 }
	const delta = { x: crop.top, y: crop.left }

	const corners = getCropCorners(crop, image)
	const rotatedCorners = mapValues(corners, ({ point }) =>
		rotatePoint(point, center, crop.angle, delta)
	)
	const top = Math.min(rotatedCorners.tr.x, rotatedCorners.tl.x)
	const bottom = Math.max(rotatedCorners.br.x, rotatedCorners.bl.x)
	const left = Math.min(rotatedCorners.bl.y, rotatedCorners.tl.y)
	const right = Math.max(rotatedCorners.br.y, rotatedCorners.tr.y)

	const constrained = { ...crop }
	if (top < 0) constrained.top -= top
	if (bottom > image.height) constrained.top -= bottom - image.height
	if (left < 0) constrained.left -= left
	if (right > image.width) constrained.left -= right - image.width
	return constrained
}

const scaleCrop = (crop, scale) => ({
	...crop,
	width: crop.width * scale,
	height: crop.height * scale,
	left: crop.left + crop.width * (1 - scale) / 2,
	top: crop.top + crop.height * (1 - scale) / 2
})

@floral
export default class AdjustView extends React.Component {
	static propTypes = {
		image: PropTypes.shape({
			width: PropTypes.number.isRequired,
			height: PropTypes.number.isRequired,
			src: PropTypes.string.isRequired
		})
	}

	static styles = (props, state) => {
		const { crop, aspect, isPanning } = state
		const { image } = props

		const DISTANCE_TO_EDGE = 30
		const horizScale = (SCREEN_WIDTH - DISTANCE_TO_EDGE * 2) / crop.width
		const vertScale =
			(SCREEN_HEIGHT -
				TOP_BAR_HEIGHT -
				BOTTOM_PANEL_HEIGHT -
				DISTANCE_TO_EDGE * 2) /
			crop.height
		const scale = Math.min(horizScale, vertScale)

		const cropWidth = crop.width * scale
		const cropHeight = crop.height * scale
		const top = (SCREEN_HEIGHT - TOP_BAR_HEIGHT - cropHeight) / 2
		const left = (SCREEN_WIDTH - cropWidth) / 2

		const originTop = (crop.top + crop.height / 2) * scale
		const originLeft = (crop.left + crop.width / 2) * scale

		return {
			container: {
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				position: 'absolute'
			},
			crop: {
				position: 'absolute',
				width: cropWidth,
				height: cropHeight,
				transform: [
					`translateY(${top}px)`,
					`translateX(${left}px)`,
					`scale(${crop.scale})`
				].join(' '),
				willChange: 'transform, width, height',
				cursor: isPanning ? 'move' : 'pointer',
				boxShadow: `0 0 0 2px #aaa`,
				transition: 'box-shadow 0.15s',
				boxSizing: 'border-box',
				borderRadius: aspect === 'circle' ? '50%' : 0
			},
			image: {
				position: 'absolute',
				width: image.width * scale,
				height: image.height * scale,
				transform: [
					`translateY(${top - crop.top * scale}px)`,
					`translateX(${left - crop.left * scale}px)`,
					`rotate(${-crop.angle}deg)`
				].join(' '),
				transformOrigin: `${originLeft}px ${originTop}px`,
				willChange: 'transform, width, height, opacity',
				opacity: isPanning ? '0.5' : '0.3'
			}
		}
	}

	constructor(props) {
		super()

		const { image } = props
		this.state = {
			aspect: 'rect',
			crop: {
				top: 30,
				left: 30,
				width: image.width - 80,
				height: image.height - 50,
				angle: 0,
				scale: 1
			}
		}
	}

	componentDidMount() {}

	componentDidUpdate() {
		this.paintCrop()
	}

	onPanStart() {
		this.initialCrop = this.state.crop
		this.setState({ isPanning: true })
	}

	onPanMove({ dx, dy }) {
		const { image } = this.props

		const rad = -this.state.crop.angle * Math.PI / 180
		const crop = {
			...this.state.crop,
			left: this.initialCrop.left - (dx * Math.cos(rad) + dy * Math.sin(rad)),
			top: this.initialCrop.top + (dx * Math.sin(rad) - dy * Math.cos(rad))
		}
		const constrainedCrop = constrainPosition(crop, image)
		this.setState({ crop: constrainedCrop })
	}

	onPanEnd() {
		this.setState({ isPanning: false })
	}

	// changeOrientation() {
	//     const orientation = this.state.rotation === 270 ? 0 : this.state.rotation + 90
	//     this.setState({ orientation })
	// }

	onRotateStart() {
		this.initialCrop = this.state.crop
	}

	onRotate(angle) {
		const { image } = this.props

		const crop = this.initialCrop
		const corners = getCropCorners(crop, image)
		const center = { x: crop.height / 2, y: crop.width / 2 }
		const delta = { x: crop.top, y: crop.left }

		let scale = 1
		Object.values(corners).forEach(({ point, constraint }) => {
			const rotatedPoint = rotatePoint(point, center, angle, delta)
			if (checkConstraint(rotatedPoint, constraint)) return

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
		})

		const scaledCrop = scaleCrop({ ...crop, angle }, scale)
		this.setState({ crop: scaledCrop })
	}

	paintCrop() {
		if (!this.imageLoaded) return

		const { crop } = this.state
		const ctx = this.canvasRef.getContext('2d')
		ctx.save()
		const originLeft = crop.width / 2
		const originTop = crop.height / 2
		ctx.translate(originLeft, originTop)
		const rad = -crop.angle * Math.PI / 180
		ctx.rotate(rad)
		ctx.drawImage(this.imageRef, -originLeft - crop.left, -originTop - crop.top)
		ctx.restore()
	}

	render() {
		const { image } = this.props
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
				{/*<Tappable onTap={this.changeOrientation.bind(this)}>
					<Icon icon={rotateIcon} />
				</Tappable>*/}
			</TopBar>
		)

		const angleSlider = (
			<AngleSlider
				value={crop.angle}
				onTapStart={this.onRotateStart.bind(this)}
				onChange={this.onRotate.bind(this)}
			/>
		)

		return (
			<OverlayLayout top={topBar} bottom={angleSlider}>
				<Tappable
					style={this.styles.container}
					onTapStart={this.onPanStart.bind(this)}
					onTapMove={this.onPanMove.bind(this)}
					onTapEnd={this.onPanEnd.bind(this)}
				>
					<img
						style={this.styles.image}
						src={image.src}
						ref={ref => {
							this.imageRef = ref
						}}
						onLoad={() => {
							this.imageLoaded = true
						}}
					/>
					<canvas
						width={crop.width}
						height={crop.height}
						style={this.styles.crop}
						ref={ref => {
							this.canvasRef = ref
						}}
					/>
				</Tappable>
			</OverlayLayout>
		)
	}
}
