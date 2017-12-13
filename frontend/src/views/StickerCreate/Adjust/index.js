import React, { Component } from 'react'
import PropTypes from 'prop-types'
import mapValues from 'lodash/mapValues'
import upperFirst from 'lodash/upperFirst'
import floral from 'floral'
import Taply from 'taply'

import FlatButton from 'material-ui/FlatButton'

import bindMethods from '@@/utils/bindMethods'
import loadImage from '@@/utils/loadImage'
import OverlayLayout from '@@/components/OverlayLayout'
import TopBar from '@@/components/TopBar'
import Icon from '@@/components/Icon'
import SvgIcon from '@@/components/SvgIcon'

// import AspectSwitcher from './AspectSwitcher'
import AngleSlider from './AngleSlider'

/*
TODO
+ !  Constrain resize
-    Side resize handles
-    Pinch scale
-    Fix mouse resize
-    Show resize crop and original crop
- !  Scale event dx/dy
-    Min crop size
- !  Change orientation
-    Fix focus in taply
- !+ Aspect - rectangle, circle
-    React to screen size change
-    Fix imports warnings
-    Taply docs
*/

import chevronLeftSvg from '!raw-loader!@@/icons/chevron-left.svg'
let arrowRightIcon
import rotateIcon from '!raw-loader!@@/icons/rotate.svg'
import cornerIcon from '!raw-loader!./corner.svg'

const SCREEN_WIDTH = document.documentElement.clientWidth
const SCREEN_HEIGHT = document.documentElement.clientHeight
const TOP_BAR_HEIGHT = 64
const BOTTOM_PANEL_HEIGHT = 112 + 16

const toRad = deg => deg * Math.PI / 180

const toDeg = rad => rad / Math.PI * 180

const rotatePoint = ([x, y], [cx, cy], [dx, dy], angle) => ({
	x: cx + dx + (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle),
	y: cy + dy + (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle)
})

const scaleCrop = (crop, scale) => ({
	...crop,
	width: crop.width * scale,
	height: crop.height * scale,
	left: crop.left + crop.width * (1 - scale) / 2,
	top: crop.top + crop.height * (1 - scale) / 2
})

const getCropSize = ({ angle, height, width }) => {
	const absAngle = Math.abs(angle)
	return {
		height: height * Math.cos(absAngle) + width * Math.sin(absAngle),
		width: height * Math.sin(absAngle) + width * Math.cos(absAngle)
	}
}

const getCropCorners = ({ width, height }) => ({
	tl: [0, 0],
	tr: [width, 0],
	bl: [0, height],
	br: [width, height]
})

const getCornersConstraints = ({ width, height }) => ({
	tl: { minY: 0, minX: 0 },
	tr: { minY: 0, maxX: width },
	bl: { maxY: height, minX: 0 },
	br: { maxY: height, maxX: width }
})

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

const pointFitScale = ([x, y], [cx, cy], [dx, dy], angle, constraint) => {
	const { minX, minY, maxX, maxY } = constraint
	const CX = minX === undefined ? maxX : minX
	const CY = minY === undefined ? maxY : minY
	const sin = Math.sin(angle)
	const cos = Math.cos(angle)

	// C = top - deltaTop + S * ( cx + (x - cx) * cos - (y - cy) * sin )
	// deltaTop = height * (S - 1) / 2 = S * cx - cx
	const xScale = (CX - dx - cx) / ((x - cx) * cos - (y - cy) * sin)

	// C = left - deltaLeft + S * ( cy + (x - cx) * sin + (y - cy) * cos )
	// deltaLeft = left * (S - 1) / 2 = S * cy - cy
	const yScale = (CY - dy - cy) / ((x - cx) * sin + (y - cy) * cos)

	return Math.min(xScale, yScale)
}

const fitScale = (crop, image) => {
	const center = [crop.width / 2, crop.height / 2]
	const delta = [crop.left, crop.top]
	const corners = getCropCorners(crop)
	const constraints = getCornersConstraints(image)

	let scale = 1
	Object.entries(corners).forEach(([key, point]) => {
		const constraint = constraints[key]
		const rotatedPoint = rotatePoint(point, center, delta, crop.angle)
		if (checkConstraint(rotatedPoint, constraint)) return
		const pointScale = pointFitScale(point, center, delta, crop.angle, constraint)
		if (pointScale < scale && pointScale > 0) scale = pointScale
	})

	return scaleCrop(crop, scale)
}

const fitPosition = (crop, image) => {
	const center = [crop.width / 2, crop.height / 2]
	const delta = [crop.left, crop.top]
	const corners = getCropCorners(crop, image)
	const rotatedCorners = mapValues(corners, point =>
		rotatePoint(point, center, delta, crop.angle)
	)
	const top = Math.min(rotatedCorners.tr.y, rotatedCorners.tl.y)
	const bottom = Math.max(rotatedCorners.br.y, rotatedCorners.bl.y)
	const left = Math.min(rotatedCorners.bl.x, rotatedCorners.tl.x)
	const right = Math.max(rotatedCorners.br.x, rotatedCorners.tr.x)

	const constrained = { ...crop }
	if (top < 0) constrained.top -= top
	if (bottom > image.height) constrained.top -= bottom - image.height
	if (left < 0) constrained.left -= left
	if (right > image.width) constrained.left -= right - image.width
	return constrained
}

const RESIZE_DIRECTIONS = {
	// resizeX, resizeY, oppositeCorner
	t: [0, -1, []],
	tl: [-1, -1, 'br'],
	tr: [1, -1, 'bl'],
	b: [0, 1, []],
	bl: [-1, 1, 'tr'],
	br: [1, 1, 'tl'],
	r: [1, 0, []],
	l: [-1, 0, []]
}

const resizeCrop = (crop, dx, dy, direction) => {
	const [resizeX, resizeY, oppositeCorner] = RESIZE_DIRECTIONS[direction]
	const rcrop = {
		...crop,
		width: crop.width + resizeX * dx,
		height: crop.height + resizeY * dy,
		top: resizeY === -1 ? crop.top + dy : crop.top,
		left: resizeX === -1 ? crop.left + dx : crop.left
	}

	// point that is opposite to resized corner should remain at the same position
	const point = rotatePoint(
		getCropCorners(crop)[oppositeCorner],
		[crop.width / 2, crop.height / 2],
		[crop.left, crop.top],
		-crop.angle
	)
	const rpoint = rotatePoint(
		getCropCorners(rcrop)[oppositeCorner],
		[rcrop.width / 2, rcrop.height / 2],
		[rcrop.left, rcrop.top],
		-crop.angle
	)
	return {
		...rcrop,
		left: rcrop.left - (rpoint.x - point.x),
		top: rcrop.top - (rpoint.y - point.y)
	}
}

const fitFullScale = (crop, image) => {
	const { width, height } = getCropSize(crop)
	if (width < image.width && height < image.height) return crop
	const scale = Math.min(image.width / width, image.height / height)
	return scaleCrop(crop, scale)
}

@floral
@bindMethods(
	'onPanStart',
	'onPanMove',
	'onPanEnd',
	'onRotateStart',
	'onRotate',
	'onResizeStart',
	'onResizeMove',
	'reset',
	'onTapNext'
)
export default class AdjustView extends Component {
	static propTypes = {
		image: PropTypes.shape({
			width: PropTypes.number.isRequired,
			height: PropTypes.number.isRequired,
			src: PropTypes.string.isRequired
		}).isRequired,
		onGoBack: PropTypes.func.isRequired,
		onGoNext: PropTypes.func.isRequired
	}

	static styles = (props, state) => {
		const { crop, aspect, isPanning } = state
		const { image } = props

		const VERT_PADDING = 10
		const HORIZ_PADDING = 20
		const horizScale = (SCREEN_WIDTH - HORIZ_PADDING * 2) / crop.width
		const vertScale =
			(SCREEN_HEIGHT -
				TOP_BAR_HEIGHT -
				BOTTOM_PANEL_HEIGHT -
				VERT_PADDING * 2) /
			crop.height
		const scale = Math.min(horizScale, vertScale)

		const cropWidth = crop.width * scale
		const cropHeight = crop.height * scale
		const top =
			TOP_BAR_HEIGHT +
			(SCREEN_HEIGHT - TOP_BAR_HEIGHT - BOTTOM_PANEL_HEIGHT - cropHeight) / 2
		const left = (SCREEN_WIDTH - cropWidth) / 2

		const originTop = (crop.top + crop.height / 2) * scale
		const originLeft = (crop.left + crop.width / 2) * scale

		const corner = {
			position: 'absolute',
			width: 16,
			height: 16,
			fill: 'white',
			padding: 10
		}

		const corners = {
			cornerTl: {
				...corner,
				top: -14,
				left: -14,
				cursor: 'nwse-resize'
			},
			cornerTr: {
				...corner,
				top: -14,
				right: -14,
				transform: 'rotate(90deg)',
				cursor: 'nesw-resize'
			},
			cornerBl: {
				...corner,
				bottom: -14,
				left: -14,
				transform: 'rotate(270deg)',
				cursor: 'nesw-resize'
			},
			cornerBr: {
				...corner,
				bottom: -14,
				right: -14,
				transform: 'rotate(180deg)',
				cursor: 'nwse-resize'
			}
		}

		return {
			container: {
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				position: 'absolute'
			},
			icon: {
				fill: 'white'
			},
			image: {
				position: 'absolute',
				width: image.width * scale,
				height: image.height * scale,
				transform: [
					`translateY(${top - crop.top * scale}px)`,
					`translateX(${left - crop.left * scale}px)`,
					`rotate(${crop.angle}rad)`
				].join(' '),
				transformOrigin: `${originLeft}px ${originTop}px`,
				willChange: 'transform, width, height, opacity',
				opacity: isPanning ? '0.5' : '0.3'
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
			canvas: {
				width: '100%',
				height: '100%'
			},
			...corners
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

	componentDidMount() {
		loadImage(this.props.image.src).then(() => {
			this.imageIsLoaded = true
			this.paintCrop()
		})
	}

	componentDidUpdate() {
		if (this.imageIsLoaded) this.paintCrop()
	}

	onPanStart() {
		this.initialCrop = this.state.crop
		this.setState({ isPanning: true })
	}

	onPanMove(event, touches) {
		const { dx, dy } = touches[0]
		const { image } = this.props
		const crop = this.initialCrop
		const movedCrop = {
			...crop,
			left: crop.left - (dx * Math.cos(crop.angle) + dy * Math.sin(crop.angle)),
			top: crop.top + (dx * Math.sin(crop.angle) - dy * Math.cos(crop.angle))
		}
		const constrainedCrop = fitPosition(movedCrop, image)
		this.setState({ crop: constrainedCrop })
	}

	onPanEnd() {
		this.setState({ isPanning: false })
	}

	onRotateStart() {
		this.initialCrop = this.state.crop
	}

	onRotate(deg) {
		const { image } = this.props
		const angle = toRad(-deg)
		const crop = this.initialCrop
		this.setState({ crop: fitScale({ ...crop, angle }, image) })
	}

	onResizeStart(event, direction) {
		event.stopPropagation()
		this.direction = direction
		this.initialCrop = this.state.crop
	}

	onResizeMove(event, touches) {
		const { dx, dy } = touches[0]
		const { image } = this.props

		event.stopPropagation()
		const resizedCrop = resizeCrop(this.initialCrop, dx, dy, this.direction)
		const fitCrop = fitFullScale(resizedCrop, image)
		const constrainedCrop = fitPosition(fitCrop, image)
		this.setState({ crop: constrainedCrop })
	}

	// PINCH
	// onPinchMove(dx, dy, scale) {}

	onTapNext() {
		const { crop } = this.state
		const ctx = this.canvasRef.getContext('2d')
		const image = ctx.getImageData(0, 0, crop.width, crop.height)
		this.props.onGoNext({ image })
	}

	reset() {
		const { image } = this.props
		this.setState({
			crop: {
				top: 0,
				left: 0,
				width: image.width,
				height: image.height,
				angle: 0,
				scale: 1
			}
		})
	}

	paintCrop() {
		if (!this.imageLoaded) return

		const { crop } = this.state
		const ctx = this.canvasRef.getContext('2d')
		ctx.save()
		const originLeft = crop.width / 2
		const originTop = crop.height / 2
		ctx.translate(originLeft, originTop)
		ctx.rotate(crop.angle)
		ctx.drawImage(this.imageRef, -originLeft - crop.left, -originTop - crop.top)
		ctx.restore()
	}

	render() {
		const { image } = this.props
		const { crop } = this.state

		const topBar = (
			<TopBar
				leftIcon={
					<Taply onTap={this.props.onGoBack}>
						<SvgIcon svg={chevronLeftSvg} style={this.styles.icon} />
					</Taply>
				}
				rightIcon={
					<Taply onTap={this.onTapNext}>
						<SvgIcon svg={chevronLeftSvg} style={this.styles.icon} />
					</Taply>
				}
				style={{ background: 'none' }}
			>
				<div>Crop photo</div>
				{/*
				<AspectSwitcher
					value={this.state.aspect}
					onChange={aspect => this.setState({ aspect })}
				/>
				<Tappable onTap={this.changeOrientation.bind(this)}>
					<Icon icon={rotateIcon} />
				</Tappable>
				*/}
			</TopBar>
		)

		const bottom = (
			<div>
				<AngleSlider
					value={toDeg(-crop.angle)}
					onRotateStart={this.onRotateStart}
					onRotate={this.onRotate}
					style={{ marginBottom: 15 }}
				/>
				<div
					style={{
						height: 48,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between'
					}}
				>
					<FlatButton>ASPECT</FlatButton>
					<FlatButton onClick={this.reset}>RESET</FlatButton>
					<FlatButton>ROTATE</FlatButton>
				</div>
			</div>
		)

		const corners = ['tl', 'tr', 'bl', 'br'].map(direction => (
			<Taply
				key={direction}
				onTapStart={event => this.onResizeStart(event, direction)}
				onTapMove={this.onResizeMove}
			>
				<SvgIcon
					svg={cornerIcon}
					style={this.styles[`corner${upperFirst(direction)}`]}
				/>
			</Taply>
		))

		return (
			<OverlayLayout top={topBar} bottom={bottom}>
				<Taply
					onTapStart={this.onPanStart}
					onTapMove={this.onPanMove}
					onTapEnd={this.onPanEnd}
				>
					<div style={this.styles.container}>
						<img
							alt=""
							style={this.styles.image}
							src={image.src}
							ref={ref => {
								this.imageRef = ref
							}}
							onLoad={() => {
								this.imageLoaded = true
							}}
						/>
						<div style={this.styles.crop}>
							<canvas
								style={this.styles.canvas}
								width={crop.width}
								height={crop.height}
								ref={ref => {
									this.canvasRef = ref
								}}
							/>
							{corners}
						</div>
					</div>
				</Taply>
			</OverlayLayout>
		)
	}
}
