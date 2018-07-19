import React, { Component } from 'react'
import PropTypes from 'prop-types'
import mapValues from 'lodash/mapValues'
import upperFirst from 'lodash/upperFirst'
import floral from 'floral'
import Taply from 'taply'
import * as PIXI from 'pixi.js'

import Matrix from '@@/utils/Matrix'

import FlatButton from 'material-ui/FlatButton'

import bindMethods from '@@/utils/bindMethods'
import OverlayLayout from '@@/components/OverlayLayout'
import TopBar from '@@/components/TopBar'
import SvgIcon from '@@/components/SvgIcon'

// import AspectSwitcher from './AspectSwitcher'
import AngleSlider from './AngleSlider'

const CANVAS_HEIGHT = document.documentElement.clientHeight
const CANVAS_WIDTH = document.documentElement.clientWidth

const distanceBetweenPoints = (a, b) =>
	Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)

/*
TODO
- !  Show resize crop and original crop
- !  Scale event dx/dy
- !  Min crop size
- !  Change orientation
-    Side resize handles
-    Pinch scale
-    Fix mouse resize
-    Fix focus in taply
-    React to screen size change
*/

import chevronLeftSvg from '!raw-loader!@@/icons/chevron-left.svg'
let arrowRightIcon
import rotateIcon from '!raw-loader!@@/icons/rotate.svg'
import cornerIcon from '!raw-loader!./corner.svg'

const SCREEN_WIDTH = document.documentElement.clientWidth
const SCREEN_HEIGHT = document.documentElement.clientHeight
const TOP_BAR_HEIGHT = 64
const BOTTOM_PANEL_HEIGHT = 64 + 48 + 16
const VERT_PADDING = 12
const HORIZ_PADDING = 24

const toRad = deg => deg * Math.PI / 180

const toDeg = rad => rad / Math.PI * 180

const rotatePoint = ([x, y], [cx, cy], [dx, dy], angle) => [
	cx + dx + (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle),
	cy + dy + (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle)
]

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
	const [x, y] = point
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

// scale down crop if it overlaps the image
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
		const pointScale = pointFitScale(
			point,
			center,
			delta,
			crop.angle,
			constraint
		)
		if (pointScale < scale && pointScale > 0) scale = pointScale
	})

	return scaleCrop(crop, scale)
}

// moves crop inside the image if it overlaps
const fitPosition = (crop, image) => {
	const center = [crop.width / 2, crop.height / 2]
	const delta = [crop.left, crop.top]
	const corners = getCropCorners(crop, image)
	const rotatedCorners = mapValues(corners, point =>
		rotatePoint(point, center, delta, crop.angle)
	)
	const top = Math.min(rotatedCorners.tr[1], rotatedCorners.tl[1])
	const bottom = Math.max(rotatedCorners.br[1], rotatedCorners.bl[1])
	const left = Math.min(rotatedCorners.bl[0], rotatedCorners.tl[0])
	const right = Math.max(rotatedCorners.br[0], rotatedCorners.tr[0])

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

	// point that is opposite to resized corner must remain at the same position
	// it moves because rotate origin moves
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
		left: rcrop.left - (rpoint[0] - point[0]),
		top: rcrop.top - (rpoint[1] - point[1])
	}
}

// scale down crop when it is bigger than image
const fitFullScale = (crop, image) => {
	const { width, height } = getCropSize(crop)
	if (width < image.width && height < image.height) return crop
	const scale = Math.min(image.width / width, image.height / height)
	return scaleCrop(crop, scale)
}

const checkConstraint2 = (point, constraint) => {
	const [x, y] = point
	const { minX, maxX, minY, maxY } = constraint
	let dx = 0
	let dy = 0
	if (minX !== undefined && x < minX) dx = minX - x
	if (maxX !== undefined && x > maxX) dx = maxX - x
	if (minY !== undefined && y < minY) dy = minY - y
	if (maxY !== undefined && y > maxY) dy = maxY - y
	return { x: dx, y: dy }
}

const fitResize = (crop, image, activeCorner) => {
	const constraints = getCornersConstraints(image)

	let rcrop = crop
	;['br', 'bl', 'tr', 'tl']
		.filter(corner => corner !== activeCorner)
		.forEach(key => {
			const corner = getCropCorners(rcrop)[key]
			const constraint = constraints[key]

			const center = [rcrop.width / 2, rcrop.height / 2]
			const delta = [rcrop.left, rcrop.top]
			const rcorner = rotatePoint(corner, center, delta, -crop.angle)

			const { x, y } = checkConstraint2(rcorner, constraint)
			const dx = Math.cos(crop.angle) * x - Math.sin(crop.angle) * y
			const dy = Math.cos(crop.angle) * y + Math.sin(crop.angle) * x
			if (dx !== 0 || dy !== 0) rcrop = resizeCrop(rcrop, dx, dy, key)
		})

	return rcrop
}

const getCornersStyles = () => {
	const corner = {
		position: 'absolute',
		width: 16,
		height: 16,
		fill: 'white',
		padding: 10
	}

	return {
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
}

const getScale = crop => {
	const horizScale = (SCREEN_WIDTH - HORIZ_PADDING * 2) / crop.width
	const vertScale =
		(SCREEN_HEIGHT - TOP_BAR_HEIGHT - BOTTOM_PANEL_HEIGHT - VERT_PADDING * 2) /
		crop.height
	return Math.min(horizScale, vertScale)
}

const styles = (props, state) => {
	const { aspect, isPanning } = state
	const { cropWidth, cropHeight, cropTop, cropLeft } = state.drawState

	return {
		icon: {
			fill: 'white'
		},
		crop: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: cropWidth,
			height: cropHeight,
			transform: `translateY(${cropTop}px) translateX(${cropLeft}px)`,
			willChange: 'transform, width, height',
			cursor: isPanning ? 'move' : 'pointer',
			boxSizing: 'border-box',
			borderRadius: aspect === 'circle' ? '50%' : 0
		},
		container: {
			width: '100%',
			height: '100%'
		},
		canvas: {
			width: '100%',
			height: '100%'
		},
		...getCornersStyles()
	}
}

// calculate crop position on the screen
const getDrawState = crop => {
	const scale = getScale(crop)
	const cropTop =
		TOP_BAR_HEIGHT +
		(SCREEN_HEIGHT -
			TOP_BAR_HEIGHT -
			BOTTOM_PANEL_HEIGHT -
			crop.height * scale) /
			2
	const cropLeft = (SCREEN_WIDTH - crop.width * scale) / 2
	const cropWidth = crop.width * scale
	const cropHeight = crop.height * scale

	return { scale, cropTop, cropLeft, cropWidth, cropHeight }
}

@floral(styles)
@bindMethods(
	'onPanStart',
	'onPanMove',
	'onPanEnd',
	'onPinchStart',
	'onPinchMove',
	'onRotateStart',
	'onRotate',
	'onResizeStart',
	'onResizeMove',
	'onResizeEnd',
	'reset',
	'onTapNext'
)
export default class AdjustView extends Component {
	static propTypes = {
		image: PropTypes.instanceOf(Image).isRequired,
		onGoBack: PropTypes.func.isRequired,
		onGoNext: PropTypes.func.isRequired
	}

	static getDerivedStateFromProps(props, state) {
		const { isResizing, crop, prevCrop } = state
		return { drawState: getDrawState(isResizing ? prevCrop : crop) }
	}

	constructor(props) {
		super()

		const { image } = props

		this.state = {
			aspect: 'rect',
			orientation: 0,
			crop: {
				top: 0,
				left: 0,
				width: image.width,
				height: image.height,
				angle: 0,
				scale: 1
			}
		}
	}

	componentDidMount() {
		this.initPixi()
		this.drawPixi()
	}

	componentDidUpdate() {
		this.drawPixi()
	}

	initPixi() {
		this.pixi = new PIXI.Application({
			view: this.pixiCanvasRef,
			transparent: true,
			width: CANVAS_WIDTH,
			height: CANVAS_HEIGHT
		})

		this.container = new PIXI.Container()
		this.pixi.stage.addChild(this.container)

		this.image = PIXI.Sprite.fromImage(this.props.image.src)
		this.container.addChild(this.image)

		this.graphics = new PIXI.Graphics()
		this.container.addChild(this.graphics)
	}

	drawPixi() {
		const { isResizing, crop, prevCrop, drawState } = this.state
		const { scale, cropTop, cropLeft } = drawState
		const actualCrop = isResizing ? prevCrop : crop

		const originX = cropLeft + actualCrop.width / 2 * scale
		const originY = cropTop + actualCrop.height / 2 * scale

		const translateX = -actualCrop.left * scale + cropLeft
		const translateY = -actualCrop.top * scale + cropTop

		// for some reason PIXI matrix works differently :<
		new PIXI.Matrix(
			...new Matrix()
				// rotate image from the center of the crop
				.translate(originX, originY)
				.rotate(crop.angle)
				.translate(-originX, -originY)
				// position image to show crop at the center of the screen
				.translate(translateX, translateY)
				.scale(scale, scale)
				.toArray()
		).decompose(this.container.transform)

		this.graphics
			.clear()
			// crop border
			.lineStyle(2 / scale, 0xcccccc, 1, 0)
			.drawRect(0, 0, crop.width, crop.height)
			// dim for cropped image
			.lineStyle(
				Math.max(SCREEN_HEIGHT, SCREEN_WIDTH) / scale,
				0x000000,
				0.5,
				1
			)
			.drawRect(0, 0, crop.width, crop.height)

		const cropOriginX = crop.width / 2
		const cropOriginY = crop.height / 2
		new PIXI.Matrix(
			...new Matrix()
				.translate(crop.left, crop.top)
				.translate(cropOriginX, cropOriginY)
				.rotate(-crop.angle)
				.translate(-cropOriginX, -cropOriginY)
				.toArray()
		).decompose(this.graphics.transform)
	}

	onPanStart() {
		this.initialCrop = this.state.crop
		this.setState({ isPanning: true })
	}

	onPanMove(event, touches) {
		const { dx, dy } = touches[0]
		const { image } = this.props
		const crop = this.initialCrop
		const scale = getScale(crop)

		event.preventDefault()

		const movedCrop = {
			...crop,
			left:
				crop.left -
				(dx * Math.cos(crop.angle) + dy * Math.sin(crop.angle)) / scale,
			top:
				crop.top +
				(dx * Math.sin(crop.angle) - dy * Math.cos(crop.angle) / scale)
		}
		const constrainedCrop = fitPosition(movedCrop, image)
		this.setState({ crop: constrainedCrop })
	}

	onPanEnd() {
		this.setState({ isPanning: false })
	}

	onPinchStart(event, touches) {
		const [t1, t2] = touches
		this.initialCrop = this.state.crop
		this.initialDistance = distanceBetweenPoints(t1, t2)
	}

	onPinchMove(event, touches) {
		const [t1, t2] = touches
		const { initialDistance, initialCrop } = this

		event.preventDefault()

		const currentDistance = distanceBetweenPoints(t1, t2)
		this.setState({
			crop: scaleCrop(initialCrop, currentDistance / initialDistance)
		})
	}

	onRotateStart() {
		this.initialCrop = this.state.crop
	}

	onRotate(deg) {
		const { image } = this.props
		const crop = this.initialCrop

		const angle = toRad(-deg)
		this.setState({ crop: fitScale({ ...crop, angle }, image) })
	}

	onResizeStart(event, direction) {
		event.stopPropagation()

		this.direction = direction
		this.initialCrop = this.state.crop

		this.setState({ isResizing: true, prevCrop: this.state.crop })
	}

	onResizeMove(event, touches) {
		const { dx, dy } = touches[0]
		const { image } = this.props
		const { prevCrop } = this.state
		const scale = getScale(prevCrop)

		event.preventDefault()
		event.stopPropagation()

		const resizedCrop = resizeCrop(
			this.initialCrop,
			dx / scale,
			dy / scale,
			this.direction
		)
		const fitCrop = fitResize(resizedCrop, image)
		this.setState({ crop: fitCrop })
	}

	onResizeEnd() {
		this.setState({ isResizing: false })
	}

	onTapNext() {
		const { crop } = this.state

		const ctx = this.canvasRef.getContext('2d')
		const image = ctx.getImageData(0, 0, crop.width, crop.height)
		this.props.onGoNext(image)
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

	renderResizeCorners() {
		const { computedStyles } = this.state
		return ['tl', 'tr', 'bl', 'br'].map(direction => (
			<Taply
				key={direction}
				onTapStart={event => this.onResizeStart(event, direction)}
				onTapMove={this.onResizeMove}
				onTapEnd={this.onResizeEnd}
			>
				<SvgIcon
					svg={cornerIcon}
					style={computedStyles[`corner${upperFirst(direction)}`]}
				/>
			</Taply>
		))
	}

	renderTopBar() {
		const { computedStyles } = this.state
		return (
			<TopBar
				leftIcon={
					<Taply onTap={this.props.onGoBack}>
						<SvgIcon svg={chevronLeftSvg} style={computedStyles.icon} />
					</Taply>
				}
				rightIcon={
					<Taply onTap={this.onTapNext}>
						<SvgIcon svg={chevronLeftSvg} style={computedStyles.icon} />
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
	}

	renderBottomBar() {
		const { crop } = this.state

		return (
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
	}

	render() {
		const { image } = this.props
		const { crop, computedStyles } = this.state

		return (
			<OverlayLayout
				top={this.renderTopBar()}
				bottom={this.renderBottomBar()}
				style={{ MozUserSelect: 'none' }}
			>
				<Taply
					onTapStart={this.onPanStart}
					onTapMove={this.onPanMove}
					onTapEnd={this.onPanEnd}
					isPinchable
					onPinchStart={this.onPinchStart}
					onPinchMove={this.onPinchMove}
				>
					<div style={computedStyles.container}>
						<canvas
							style={computedStyles.canvas}
							width={CANVAS_WIDTH}
							height={CANVAS_HEIGHT}
							ref={ref => {
								this.pixiCanvasRef = ref
							}}
						/>
						<div style={computedStyles.crop}>
							{this.renderResizeCorners()}
						</div>
					</div>
				</Taply>
			</OverlayLayout>
		)
	}
}
