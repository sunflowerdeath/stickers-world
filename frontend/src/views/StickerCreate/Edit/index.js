import React, { Component } from 'react'
import PropTypes from 'prop-types'
import floral from 'floral'
import Taply from 'taply'
import { contours } from 'd3-contour'
import flatten from 'lodash/flatten'

import Slider from 'material-ui/Slider'
import FlatButton from 'material-ui/FlatButton'
import { Tabs, Tab } from 'material-ui/Tabs'

import bg from './bg.svg'
import chevronLeftSvg from '!raw-loader!@@/icons/chevron-left.svg'
import brushSvg from '!raw-loader!@@/icons/brush.svg'
import eraserSvg from '!raw-loader!@@/icons/eraser.svg'
import visibilitySvg from '!raw-loader!@@/icons/visibility.svg'
import visibilityOffSvg from '!raw-loader!@@/icons/visibility-off.svg'

import simplify from '@@/utils/simplify'
import bindMethods from '@@/utils/bindMethods'
import { Toolbar, ToolbarGroup, ToolbarCaption } from '@@/components/Toolbar'
import IconButton from '@@/components/IconButton'

import BackgroundSwitcher from './BackgroundSwitcher'
import backgroundStyles from './BackgroundSwitcher/backgroundStyles'

const CANVAS_HEIGHT = document.documentElement.clientHeight
const CANVAS_WIDTH = document.documentElement.clientWidth
const TOP_BAR_HEIGHT = 48
const BOTTOM_BAR_HEIGHTS = {
	mask: 48 * 2,
	effects: 48 * 3
}
const CANVAS_PADDING = 24

/*
const getRelativeCoords = ({ x, y }, elem) => {
	const { left, top } = elem.getBoundingClientRect()
	return { x: x - left, y: y - top }
}
*/

const centerImage = ({ image, canvas, selectedTab }) => {
	const availableHeight =
		canvas.height - TOP_BAR_HEIGHT - BOTTOM_BAR_HEIGHTS[selectedTab]
	const scale = Math.min(
		availableHeight / (image.height + CANVAS_PADDING),
		canvas.width / (image.width + CANVAS_PADDING)
	)
	return {
		scale,
		translateX: canvas.width / 2 - image.width / 2 * scale,
		translateY: TOP_BAR_HEIGHT + availableHeight / 2 - image.height / 2 * scale
	}
}

const getCoordsOnImage = ({ x, y }, { translateX, translateY, scale }) => ({
	x: (x - translateX) / scale,
	y: (y - translateY) / scale
})

const getOutlines = imageData => {
	const { width, height, data } = imageData
	const generator = contours()
		.size([width, height])
		.smooth(true)
		.thresholds([128])
	const grid = new Uint8Array(width * height)
	for (let x = 0; x < width; x += 1) {
		for (let y = 0; y < height; y += 1) {
			const index = y * width + x
			grid[index] = data[index * 4 + 3]
		}
	}
	const outlines = flatten(generator(grid)[0].coordinates)
	return outlines.map(points => simplify(points, 1))
}

const drawOutline = (ctx, points) => {
	ctx.beginPath()
	ctx.moveTo(points[0][0], points[0][1])
	for (let i = 1; i < points.length; i += 1) {
		const point = points[i]
		ctx.lineTo(point[0], point[1])
	}
	ctx.closePath()
	ctx.stroke()
}

const distanceBetweenPoints = (a, b) => Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)

const centerBetweenPoints = (a, b) => ({
	x: a.x + (b.x - a.x) / 2,
	y: a.y + (b.y - a.y) / 2
})

const getStyles = (props, state) => {
	const { brushSize, showBrushPreview, background, transform, scaleMultiplier } = state

	const scaledBrushSize = brushSize * transform.scale / scaleMultiplier
	const brush = {
		position: 'absolute',
		width: scaledBrushSize,
		height: scaledBrushSize,
		boxSizing: 'border-box',
		transform: 'translateY(-50%) translateX(-50%)',
		borderRadius: '50%',
		border: '2px solid white',
		filter: 'drop-shadow(1px 1px 2px black)'
	}

	const brushPreview = showBrushPreview && {
		...brush,
		border: '2px dashed white',
		top: -48,
		left: '50%'
	}

	return {
		root: {
			position: 'relative',
			height: '100%'
		},
		icon: {
			fill: 'white'
		},
		topBar: {
			background: 'black',
			zIndex: 1,
			position: 'absolute',
			width: '100%',
			top: 0,
			left: 0
		},
		bottomBar: {
			background: 'black',
			position: 'absolute',
			width: '100%',
			bottom: 0,
			left: 0
		},
		image: {
			position: 'absolute',
			width: '100%',
			height: CANVAS_HEIGHT,
			left: 0,
			top: 0,
			flexGrow: 1,
			...backgroundStyles[background]
		},
		brush,
		brushPreview,
		tab: {
			color: 'white'
		},
		bar: {
			color: 'white',
			display: 'flex',
			padding: '0 24px',
			height: 48,
			alignItems: 'center'
		},
		slider: {
			flexGrow: 1,
			marginRight: 24
		},
		caption: {
			fontWeight: 'bold',
			textTransform: 'uppercase',
			marginRight: 24
		}
	}
}

@floral
@bindMethods(
	'onTapBack',
	'onTapDone',
	'onMaskStart',
	'onMaskMove',
	'onMaskEnd',
	'onPinchStart',
	'onPinchMove',
	'onChangeTab'
)
export default class EditView extends Component {
	static propTypes = {
		image: PropTypes.instanceOf(ImageData).isRequired,
		onGoBack: PropTypes.func.isRequired,
		onGoNext: PropTypes.func.isRequired
	}

	static styles = getStyles

	constructor(props) {
		super()

		const { image } = props

		this.maskCanvas = document.createElement('canvas')
		this.maskCanvas.width = image.width
		this.maskCanvas.height = image.height

		this.imageCanvas = document.createElement('canvas')
		this.imageCanvas.width = image.width
		this.imageCanvas.height = image.height
		const ctx = this.imageCanvas.getContext('2d')
		ctx.putImageData(image, 0, 0)

		const transform = centerImage({
			selectedTab: 'mask',
			canvas: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
			image
		})

		this.state = {
			selectedTab: 'mask',
			background: 'chekers',
			drawMasked: false,
			brushSize: 30,
			outlineWidth: 4,
			outlineColor: 'white',
			shadowSize: 5,
			transform,
			scaleMultiplier: transform.scale
		}
	}

	componentDidMount() {
		this.draw()
	}

	componentDidUpdate() {
		this.draw()
	}

	onTapBack() {
		this.props.onGoBack()
	}

	onTapDone() {
		this.props.onGoNext()
	}

	onMaskStart(event, touches) {
		const touch = touches[0]
		const { transform } = this.state

		this.prevCoords = getCoordsOnImage(touch, transform)
		this.setState({ isMasking: true }, () => this.updateBrushPosition(touch))
	}

	onMaskMove(event, touches) {
		event.preventDefault()

		const touch = touches[0]
		const { brushSize, unmask, scaleMultiplier, transform } = this.state
		const coords = getCoordsOnImage(touch, transform)

		const ctx = this.maskCanvas.getContext('2d')
		ctx.globalCompositeOperation = unmask ? 'destination-out' : 'source-over'
		ctx.lineWidth = brushSize / scaleMultiplier
		ctx.lineCap = 'round'
		ctx.beginPath()
		ctx.moveTo(this.prevCoords.x, this.prevCoords.y)
		ctx.lineTo(coords.x, coords.y)
		ctx.stroke()

		this.prevCoords = coords
		this.updateBrushPosition(touch)
		this.draw()
	}

	onMaskEnd() {
		this.setState({ isMasking: false })
	}

	onPinchStart(event, touches) {
		const [t1, t2] = touches
		const { transform } = this.state

		this.initialTransform = transform
		this.initialDistance = distanceBetweenPoints(t1, t2)
		this.initialCenterOnImage = getCoordsOnImage(
			centerBetweenPoints(t1, t2),
			transform
		)
	}

	onPinchMove(event, touches) {
		const [t1, t2] = touches
		const { initialTransform, initialDistance, initialCenterOnImage } = this

		event.preventDefault()

		const currentDistance = distanceBetweenPoints(t1, t2)
		const scale = initialTransform.scale * currentDistance / initialDistance
		const currentCenter = centerBetweenPoints(t1, t2)
		this.setState({
			transform: {
				scale,
				translateX: currentCenter.x - initialCenterOnImage.x * scale,
				translateY: currentCenter.y - initialCenterOnImage.y * scale
			}
		})
	}

	onChangeTab(tab) {
		this.setState({
			selectedTab: tab,
			transform: centerImage({
				selectedTab: tab,
				canvas: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
				image: this.props.image
			})
		})
	}

	updateBrushPosition({ x, y }) {
		this.brushRef.style.left = `${x}px`
		this.brushRef.style.top = `${y}px`
	}

	draw() {
		const { selectedTab } = this.state

		const ctx = this.canvasRef.getContext('2d')
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
		this.drawImage(ctx)
		if (selectedTab === 'effects') this.drawEffects(ctx)
	}

	drawImage(ctx) {
		const { image } = this.props
		const { selectedTab, showMasked, transform } = this.state
		const { translateX, translateY, scale } = transform

		const width = image.width * scale
		const height = image.height * scale

		// draw image
		ctx.globalAlpha = 1
		ctx.globalCompositeOperation = 'source-over'
		ctx.drawImage(this.imageCanvas, translateX, translateY, width, height)

		// mask image
		ctx.globalCompositeOperation = 'destination-out'
		ctx.drawImage(this.maskCanvas, translateX, translateY, width, height)

		// draw transparent image over masked image
		if (selectedTab === 'mask' && showMasked) {
			ctx.globalCompositeOperation = 'source-over'
			ctx.globalAlpha = 0.5
			ctx.drawImage(this.imageCanvas, translateX, translateY, width, height)
		}
	}

	drawEffects(ctx) {
		const { outlineWidth, shadowSize } = this.state

		if (outlineWidth > 0) this.drawOutline(ctx)
		if (shadowSize > 3) this.drawShadow(ctx)
	}

	drawOutline(ctx) {
		const { outlineColor, outlineWidth } = this.state

		const outlines = getOutlines(ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT))
		ctx.strokeStyle = outlineColor

		// 1px inner outline
		ctx.globalCompositeOperation = 'source-over'
		ctx.lineWidth = 2
		outlines.forEach(points => drawOutline(ctx, points))

		// outer outline
		if (outlineWidth > 1) {
			ctx.globalCompositeOperation = 'destination-over'
			ctx.lineWidth = outlineWidth * 2
			outlines.forEach(points => drawOutline(ctx, points))
		}
	}

	drawShadow(ctx) {
		const { shadowColor, shadowSize } = this.state

		ctx.globalCompositeOperation = 'destination-over'
		ctx.shadowColor = 'rgba(0,0,0,0.6)'
		ctx.shadowOffsetY = 1
		ctx.shadowOffsetX = 1
		ctx.shadowBlur = shadowSize
		ctx.drawImage(this.canvasRef, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
		ctx.shadowColor = 'transparent'
	}

	renderTopBar() {
		const backIcon = (
			<IconButton
				svg={chevronLeftSvg}
				fill="white"
				size="big"
				onTap={this.onTapBack}
			/>
		)

		const doneButton = <FlatButton onClick={this.onTapDone}>Done</FlatButton>

		return (
			<div style={this.styles.topBar}>
				<Toolbar style={{ paddingLeft: 0 }}>
					{backIcon}
					<div
						style={{
							fontWeight: 500,
							fontSize: 18,
							marginRight: 24
						}}
					>
						Edit
					</div>
					<BackgroundSwitcher
						onChange={value => this.setState({ background: value })}
					/>
					{doneButton}
				</Toolbar>
			</div>
		)
	}

	renderMaskTab() {
		const { unmask, showMasked, showBrushPreview } = this.state
		const lightWhite = 'rgba(255, 255, 255, 0.54)'

		return (
			<div style={this.styles.tab} key="mask">
				{showBrushPreview && <div style={this.styles.brushPreview} />}
				<Toolbar>
					<ToolbarGroup>
						<IconButton
							svg={brushSvg}
							fill={unmask ? lightWhite : 'white'}
							style={{ marginRight: 0 }}
							onTap={() => this.setState({ unmask: false })}
						/>
						<IconButton
							svg={eraserSvg}
							fill={unmask ? 'white' : lightWhite}
							onTap={() => this.setState({ unmask: true })}
						/>
					</ToolbarGroup>
					<Slider
						style={this.styles.slider}
						sliderStyle={{ margin: 0 }}
						min={20}
						max={50}
						step={1}
						value={this.state.brushSize}
						onChange={(event, value) => this.setState({ brushSize: value })}
						onDragStart={() => this.setState({ showBrushPreview: true })}
						onDragStop={() => this.setState({ showBrushPreview: false })}
					/>
					<IconButton
						svg={showMasked ? visibilitySvg : visibilityOffSvg}
						fill="white"
						onTap={() => this.setState({ showMasked: !showMasked })}
					/>
				</Toolbar>
			</div>
		)
	}

	renderEffectsTab() {
		const { outlineWidth, shadowSize } = this.state

		return (
			<div style={this.styles.tab} key="effects">
				<Toolbar>
					<ToolbarCaption style={{ width: 75 }}>Border</ToolbarCaption>
					<Slider
						style={this.styles.slider}
						sliderStyle={{ margin: 0 }}
						min={0}
						max={8}
						step={1}
						value={outlineWidth}
						onChange={(event, value) =>
							this.setState({ outlineWidth: value })
						}
					/>
				</Toolbar>
				<Toolbar>
					<ToolbarCaption style={{ width: 75 }}>Shadow</ToolbarCaption>
					<Slider
						style={this.styles.slider}
						sliderStyle={{ margin: 0 }}
						min={3}
						max={10}
						step={1}
						value={shadowSize}
						onChange={(event, value) => this.setState({ shadowSize: value })}
					/>
					<IconButton svg={visibilitySvg} fill="white" />
				</Toolbar>
			</div>
		)
	}

	/*
	renderTextTab() {
		return <div style={this.styles.tab}>TEXT</div>
	}
	*/

	renderBottomBar() {
		const { selectedTab } = this.state

		const tabs = (
			<Tabs value={this.state.selectedTab} onChange={this.onChangeTab}>
				<Tab value="mask" label="Mask" />
				<Tab value="effects" label="Effects" />
				{/* <Tab value="text" label="Text" /> */}
			</Tabs>
		)

		const content = do {
			if (selectedTab === 'mask') this.renderMaskTab()
			else if (selectedTab === 'effects') this.renderEffectsTab()
			else if (selectedTab === 'text') this.renderTextTab()
		}

		return (
			<div style={this.styles.bottomBar}>
				{content}
				{tabs}
			</div>
		)
	}

	renderCanvas() {
		const { isMasking, selectedTab } = this.state

		return (
			<Taply
				isDisabled={selectedTab !== 'mask'}
				isPinchable
				onTapStart={this.onMaskStart}
				onTapMove={this.onMaskMove}
				onTapEnd={this.onMaskEnd}
				onPinchStart={this.onPinchStart}
				onPinchMove={this.onPinchMove}
			>
				<div style={{ ...this.styles.image, height: CANVAS_HEIGHT }}>
					<canvas
						style={this.styles.canvas}
						ref={ref => {
							this.canvasRef = ref
						}}
						width={CANVAS_WIDTH}
						height={CANVAS_HEIGHT}
					/>
					{isMasking && (
						<div
							style={this.styles.brush}
							ref={ref => {
								this.brushRef = ref
							}}
						/>
					)}
				</div>
			</Taply>
		)
	}

	render() {
		return (
			<div style={this.styles.root}>
				{this.renderTopBar()}
				{this.renderCanvas()}
				{this.renderBottomBar()}
			</div>
		)
	}
}
