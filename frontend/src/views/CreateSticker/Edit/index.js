import React, { Component } from 'react'
import PropTypes from 'prop-types'
import floral from 'floral'
import Taply from 'taply'

import Slider from 'material-ui/Slider'
import FlatButton from 'material-ui/FlatButton'

import chevronLeftSvg from '!raw-loader!@@/icons/chevron-left.svg'
import brushSvg from '!raw-loader!@@/icons/brush.svg'
import eraserSvg from '!raw-loader!@@/icons/eraser.svg'
import visibilitySvg from '!raw-loader!@@/icons/visibility.svg'
import visibilityOffSvg from '!raw-loader!@@/icons/visibility-off.svg'

import bindMethods from '@@/utils/bindMethods'
import { Toolbar, ToolbarGroup, ToolbarCaption } from '@@/components/Toolbar'
import { Tabs, Tab } from '@@/components/Tabs'
import IconButton from '@@/components/IconButton'

import BackgroundSwitcher from './BackgroundSwitcher'
import backgroundStyles from './BackgroundSwitcher/backgroundStyles'
import drawSticker from './drawSticker'
import getStickerImage from './getStickerImage'

const CANVAS_HEIGHT = document.documentElement.clientHeight
const CANVAS_WIDTH = document.documentElement.clientWidth
const TOP_BAR_HEIGHT = 48
const BOTTOM_BAR_HEIGHTS = {
	mask: 48 * 2,
	effects: 48 * 3,
	text: 48
}
const CANVAS_PADDING = 24

const centerImage = ({ image, canvas, selectedTab }) => {
	const availableHeight =
		canvas.height - TOP_BAR_HEIGHT - BOTTOM_BAR_HEIGHTS[selectedTab]
	const scale = Math.min(
		availableHeight / (image.height + CANVAS_PADDING * 2),
		canvas.width / (image.width + CANVAS_PADDING * 2)
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

const distanceBetweenPoints = (a, b) =>
	Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)

const centerBetweenPoints = (a, b) => ({
	x: a.x + (b.x - a.x) / 2,
	y: a.y + (b.y - a.y) / 2
})

const styles = (props, state) => {
	const {
		brushSize,
		showBrushPreview,
		background,
		transform,
		scaleMultiplier
	} = state

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

@floral(styles)
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
class EditView extends Component {
	static propTypes = {
		image: PropTypes.instanceOf(ImageData).isRequired,
		onGoBack: PropTypes.func.isRequired,
		onGoNext: PropTypes.func.isRequired
	}

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
			scaleMultiplier: transform.scale,
			texts: []
		}
	}

	componentDidMount() {
		this.drawSticker()
	}

	componentDidUpdate() {
		this.drawSticker()
	}

	onTapBack() {
		this.props.onGoBack()
	}

	async onTapDone() {
		const {
			outlineWidth,
			outlineColor,
			shadowSize,
			texts
		} = this.state
		const sticker = await getStickerImage({
			image: this.imageCanvas,
			mask: this.maskCanvas,
			outline: { width: outlineWidth, color: outlineColor },
			shadow: { size: shadowSize },
			texts
		})
		this.props.onGoNext({ sticker })
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
		this.drawSticker()
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

	drawSticker() {
		const {
			drawMasked,
			transform,
			selectedTab,
			outlineWidth,
			outlineColor,
			shadowSize
		} = this.state
		drawSticker({
			canvas: this.canvasRef,
			image: this.imageCanvas,
			mask: this.maskCanvas,
			drawMasked,
			transform,
			drawEffects: selectedTab === 'effects',
			outline: { width: outlineWidth, color: outlineColor },
			shadow: { size: shadowSize }
		})
	}

	updateBrushPosition({ x, y }) {
		this.brushRef.style.left = `${x}px`
		this.brushRef.style.top = `${y}px`
	}

	renderTopBar() {
		const { computedStyles } = this.state

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
			<div style={computedStyles.topBar}>
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
		const { computedStyles, unmask, drawMasked, showBrushPreview } = this.state
		const lightWhite = 'rgba(255, 255, 255, 0.54)'

		return (
			<div style={computedStyles.tab} key="mask">
				{showBrushPreview && <div style={computedStyles.brushPreview} />}
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
						style={computedStyles.slider}
						sliderStyle={{ margin: 0 }}
						min={20}
						max={50}
						step={1}
						value={this.state.brushSize}
						onChange={(event, value) =>
							this.setState({ brushSize: value })
						}
						onDragStart={() => this.setState({ showBrushPreview: true })}
						onDragStop={() => this.setState({ showBrushPreview: false })}
					/>
					<IconButton
						svg={drawMasked ? visibilitySvg : visibilityOffSvg}
						fill="white"
						onTap={() => this.setState({ drawMasked: !drawMasked })}
					/>
				</Toolbar>
			</div>
		)
	}

	renderEffectsTab() {
		const { computedStyles, outlineWidth, shadowSize } = this.state

		return (
			<div style={computedStyles.tab} key="effects">
				<Toolbar>
					<ToolbarCaption style={{ width: 75 }}>Border</ToolbarCaption>
					<Slider
						style={computedStyles.slider}
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
						style={computedStyles.slider}
						sliderStyle={{ margin: 0 }}
						min={3}
						max={10}
						step={1}
						value={shadowSize}
						onChange={(event, value) =>
							this.setState({ shadowSize: value })
						}
					/>
					<IconButton svg={visibilitySvg} fill="white" />
				</Toolbar>
			</div>
		)
	}

	addText() {
		const text = { top: 50, left: 50, text: '' }
		this.setState({
			texts: [...this.state.texts, text],
			selectedText: text
		})
	}

	renderTextTab() {
		const { computedStyles } = this.state
		return (
			<div style={computedStyles.tab}>
				<Toolbar>
					<div onClick={this.addText.bind(this)}>Add</div>
				</Toolbar>
			</div>
		)
	}

	renderBottomBar() {
		const { computedStyles, selectedTab } = this.state

		const tabs = (
			<Tabs value={this.state.selectedTab} onChange={this.onChangeTab}>
				<Tab value="mask">Mask</Tab>
				<Tab value="effects">Effects</Tab>
				<Tab value="text">Text</Tab>
			</Tabs>
		)

		const content = do {
			if (selectedTab === 'mask') this.renderMaskTab()
			else if (selectedTab === 'effects') this.renderEffectsTab()
			else if (selectedTab === 'text') this.renderTextTab()
		}

		return (
			<div style={computedStyles.bottomBar}>
				{content}
				{tabs}
			</div>
		)
	}

	renderCanvas() {
		const { computedStyles, isMasking, selectedTab } = this.state

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
				<div style={{ ...computedStyles.image, height: CANVAS_HEIGHT }}>
					<canvas
						style={computedStyles.canvas}
						ref={ref => {
							this.canvasRef = ref
						}}
						width={CANVAS_WIDTH}
						height={CANVAS_HEIGHT}
					/>
					{isMasking && (
						<div
							style={computedStyles.brush}
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
		const { computedStyles } = this.state
		return (
			<div style={computedStyles.root}>
				{this.renderTopBar()}
				{this.renderCanvas()}
				{this.renderBottomBar()}
			</div>
		)
	}
}

export default EditView
