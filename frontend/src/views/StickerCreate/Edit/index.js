import React, { Component } from 'react'
import PropTypes from 'prop-types'
import floral from 'floral'
import Taply from 'taply'
import { contours } from 'd3-contour'

import Slider from 'material-ui/Slider'
import FlatButton from 'material-ui/FlatButton'
import { Tabs, Tab } from 'material-ui/Tabs'

import bg from './bg.svg'
import chevronLeftSvg from '!raw-loader!@@/icons/chevron-left.svg'
import brushSvg from '!raw-loader!@@/icons/brush.svg'
import eraserSvg from '!raw-loader!@@/icons/eraser.svg'
import visibilitySvg from '!raw-loader!@@/icons/visibility.svg'
import visibilityOffSvg from '!raw-loader!@@/icons/visibility-off.svg'

import bindMethods from '@@/utils/bindMethods'
import SvgIcon from '@@/components/SvgIcon'
import TopBar from '@@/components/TopBar'

import BackgroundSwitcher from './BackgroundSwitcher'
import backgroundStyles from './BackgroundSwitcher/backgroundStyles'

const iconButtonStyle = {
	borderRadius: '50%',
	width: 24,
	height: 24,
	padding: 12,
	flexShrink: 0,
	outline: 'none',
	transition: 'background 0.25s',
	marginLeft: -12,
	marginRight: -12
}
const IconButton = ({ svg, onTap, fill, style }) => (
	<Taply onTap={onTap}>
		<SvgIcon
			svg={svg}
			style={{
				...iconButtonStyle,
				fill,
				...style
			}}
		/>
	</Taply>
)

const SCREEN_WIDTH = document.documentElement.clientWidth
const SCREEN_HEIGHT = document.documentElement.clientHeight
const TOP_BAR_HEIGHT = 64
const BOTTOM_BAR_HEIGHT = 48 * 2
const CANVAS_HEIGHT = SCREEN_HEIGHT - TOP_BAR_HEIGHT - BOTTOM_BAR_HEIGHT
const CANVAS_WIDTH = SCREEN_WIDTH

const getTransformedImageCoords = ({ canvas, image, scale, translate }) => ({
	x: canvas.width / 2 - scale * image.width / 2,
	y: canvas.height / 2 - scale * image.height / 2,
	width: image.width * scale,
	height: image.height * scale
})

const getRelativeCoords = ({ x, y }, elem) => {
	const { left, top } = elem.getBoundingClientRect()
	return { x: x - left, y: y - top }
}

const drawPolygon = (ctx, points) => {
	ctx.beginPath()
	ctx.moveTo(points[0][0], points[0][1])
	for (let i = 1; i < points.length; i += 1) {
		const point = points[i]
		ctx.lineTo(point[0], point[1])
	}
	ctx.closePath()
	ctx.stroke()
}

@floral
@bindMethods('onTapBack', 'onTapDone', 'onMaskStart', 'onMaskMove', 'onMaskEnd')
class EditView extends Component {
	static propTypes = {
		image: PropTypes.instanceOf(ImageData).isRequired,
		onGoBack: PropTypes.func.isRequired,
		onGoNext: PropTypes.func.isRequired
	}

	static styles = (props, state) => {
		const { brushSize, showBrushPreview, background } = state

		const brush = {
			position: 'absolute',
			width: brushSize,
			height: brushSize,
			boxSizing: 'border-box',
			transform: 'translateY(-50%) translateX(-50%)',
			borderRadius: '50%',
			border: '2px solid white',
			filter: 'drop-shadow(1px 1px 2px black)'
		}

		const brushPreview = showBrushPreview && {
			...brush,
			border: '2px dashed white',
			top: 'calc(100% - 32px)',
			left: '50%'
		}

		return {
			root: {
				display: 'flex',
				flexDirection: 'column',
				height: '100%'
			},
			icon: {
				fill: 'white'
			},
			image: {
				position: 'relative',
				flexGrow: 1,
				...backgroundStyles[background]
			},
			brush,
			brushPreview,
			tab: {
				color: 'white'
			},
			bar: {
				display: 'flex',
				padding: '0 24px',
				height: 48,
				alignItems: 'center'
			}
		}
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

		const scaleMultiplier = Math.min(
			(SCREEN_HEIGHT - TOP_BAR_HEIGHT - BOTTOM_BAR_HEIGHT) / (image.height + 20),
			SCREEN_WIDTH / (image.width + 20)
		)

		this.state = {
			selectedTab: 'mask',
			background: 'chekers',
			paintMasked: false,
			brushSize: 30,
			scale: 1,
			scaleMultiplier
		}
	}

	componentDidMount() {
		this.paint()
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.showMasked !== this.state.showMasked) this.paint()
	}

	onTapBack() {
		this.props.onGoBack()
	}

	onTapDone() {
		this.props.onGoNext()
	}

	onMaskStart(event, touches) {
		const imageCoords = this.getImageCoords()
		const relCoords = this.getRelCoords(touches[0])
		const maskCoords = this.getMaskCoords({ imageCoords, relCoords })
		this.prevCoords = maskCoords
		this.setState({ isMasking: true }, () => this.updateBrushPosition(relCoords))
	}

	onMaskMove(event, touches) {
		event.preventDefault()
		const { brushSize, scaleMultiplier, unmask } = this.state
		const { x: x0, y: y0 } = this.prevCoords
		const imageCoords = this.getImageCoords()
		const relCoords = this.getRelCoords(touches[0])
		const maskCoords = this.getMaskCoords({ imageCoords, relCoords })

		const ctx = this.maskCanvas.getContext('2d')
		ctx.globalCompositeOperation = unmask ? 'destination-out' : 'source-over'
		ctx.lineWidth = brushSize / scaleMultiplier
		ctx.lineCap = 'round'
		ctx.beginPath()
		ctx.moveTo(x0, y0)
		ctx.lineTo(maskCoords.x, maskCoords.y)
		ctx.stroke()

		this.prevCoords = maskCoords
		this.updateBrushPosition(relCoords)
		this.paint()
	}

	onMaskEnd() {
		this.setState({ isMasking: false })
	}

	getScale() {
		const { scale, scaleMultiplier } = this.state
		return scale * scaleMultiplier
	}

	getRelCoords(coords) {
		return getRelativeCoords(coords, this.canvasRef)
	}

	getImageCoords() {
		const { image } = this.props
		return getTransformedImageCoords({
			canvas: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
			image,
			scale: this.getScale(),
			translate: { x: 0, y: 0 }
		})
	}

	getMaskCoords({ relCoords, imageCoords }) {
		const scale = this.getScale()
		return {
			x: (relCoords.x - imageCoords.x) / scale,
			y: (relCoords.y - imageCoords.y) / scale
		}
	}

	updateBrushPosition({ x, y }) {
		this.brushRef.style.left = `${x}px`
		this.brushRef.style.top = `${y}px`
	}

	paint() {
		const { showMasked } = this.state
		const { x, y, width, height } = this.getImageCoords()
		const ctx = this.canvasRef.getContext('2d')

		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

		// paint image
		ctx.globalAlpha = 1
		ctx.globalCompositeOperation = 'source-over'
		ctx.drawImage(this.imageCanvas, x, y, width, height)

		// mask image
		ctx.globalCompositeOperation = 'destination-out'
		ctx.drawImage(this.maskCanvas, x, y, width, height)

		// paint transparent image over masked image
		if (showMasked) {
			ctx.globalCompositeOperation = 'source-over'
			ctx.globalAlpha = 0.5
			ctx.drawImage(this.imageCanvas, x, y, width, height)
		}

		this.drawOutline()
	}

	countoursGrid = new Uint8Array(CANVAS_WIDTH * CANVAS_HEIGHT)

	getOutline() {
		const ctx = this.canvasRef.getContext('2d')
		const generator = contours()
			.size([CANVAS_WIDTH, CANVAS_HEIGHT])
			.smooth(true)
			.thresholds([128])

		const data = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data

		for (let x = 0; x < CANVAS_WIDTH; x += 1) {
			for (let y = 0; y < CANVAS_HEIGHT; y += 1) {
				const index = y * CANVAS_WIDTH + x
				this.countoursGrid[index] = data[index * 4 + 3]
			}
		}

		return generator(this.countoursGrid)
	}

	drawOutline() {
		const outline = this.getOutline()

		const ctx = this.canvasRef.getContext('2d')
		ctx.globalCompositeOperation = 'source-over'
		ctx.strokeStyle = 'red'
		ctx.lineWidth = 2

		outline[0].coordinates.forEach(hz => {
			hz.forEach(points => drawPolygon(ctx, points))
		})
	}

	renderTopBar() {
		const backIcon = (
			<Taply onTap={this.onTapBack}>
				<SvgIcon svg={chevronLeftSvg} style={this.styles.icon} />
			</Taply>
		)

		const doneButton = (
			<FlatButton
				onClick={() => {
					window.CONTOURS = this.paintOutlinePath()
					console.log(window.CONTOURS)
					// this.onTapDone
				}}
			>
				Done
			</FlatButton>
		)

		return (
			<TopBar leftIcon={backIcon} rightIcon={doneButton}>
				Edit
				<BackgroundSwitcher
					onChange={value => this.setState({ background: value })}
				/>
			</TopBar>
		)
	}

	renderMaskTab() {
		const { unmask, showMasked } = this.state
		const lightWhite = 'rgba(255, 255, 255, 0.54)'

		return (
			<div style={this.styles.tab}>
				<div style={this.styles.bar}>
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

					<Slider
						style={{ margin: '0 24px', flexGrow: 1 }}
						sliderStyle={{ margin: 0 }}
						min={20}
						max={60}
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
				</div>
			</div>
		)
	}

	renderEffectsTab() {
		return (
			<div style={this.styles.tab}>
				<div style={this.styles.bar}>
					<b>BORDER</b>
					<Slider style={{ width: 150 }} sliderStyle={{ margin: 0 }} />
				</div>
				<div style={this.styles.bar}>
					<b>SHADOW</b>
					<Slider style={{ width: 150 }} sliderStyle={{ margin: 0 }} />
				</div>
			</div>
		)
	}

	renderTextTab() {
		return <div style={this.styles.tab}>TEXT</div>
	}

	renderBottomBar() {
		const { selectedTab } = this.state

		const tabs = (
			<Tabs
				value={this.state.selectedTab}
				onChange={tab => this.setState({ selectedTab: tab })}
			>
				<Tab value="mask" label="Mask" />
				<Tab value="effects" label="Effects" />
				<Tab value="text" label="Text" />
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

	renderImage() {
		const { isMasking, showBrushPreview } = this.state

		return (
			<Taply
				onTapStart={this.onMaskStart}
				onTapMove={this.onMaskMove}
				onTapEnd={this.onMaskEnd}
			>
				<div style={this.styles.image}>
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
					{showBrushPreview && <div style={this.styles.brushPreview} />}
				</div>
			</Taply>
		)
	}

	render() {
		return (
			<div style={this.styles.root}>
				{this.renderTopBar()}
				{this.renderImage()}
				{this.renderBottomBar()}
			</div>
		)
	}
}

export default EditView
