import React, { Component } from 'react'
import PropTypes from 'prop-types'
import floral from 'floral'
import Taply from 'taply'

import Slider from 'material-ui/Slider'
import FlatButton from 'material-ui/FlatButton'
import { Tabs, Tab } from 'material-ui/Tabs'

import bg from './bg.svg'
import chevronLeftSvg from '!raw-loader!@@/icons/chevron-left.svg'

import bindMethods from '@@/utils/bindMethods'
import SvgIcon from '@@/components/SvgIcon'
import TopBar from '@@/components/TopBar'

const SCREEN_WIDTH = document.documentElement.clientWidth
const SCREEN_HEIGHT = document.documentElement.clientHeight
const TOP_BAR_HEIGHT = 64
const BOTTOM_BAR_HEIGHT = 48 * 3
const CANVAS_HEIGHT = SCREEN_HEIGHT - TOP_BAR_HEIGHT - BOTTOM_BAR_HEIGHT
const CANVAS_WIDTH = SCREEN_WIDTH

const getTransformedImageCoords = ({ canvas, image, scale, translate }) => {
	return {
		x: canvas.width / 2 - scale * image.width / 2,
		y: canvas.height / 2 - scale * image.height / 2,
		width: image.width * scale,
		height: image.height * scale
	}
}

const getRelativeCoords = ({ x, y }, elem) => {
	const { left, top } = elem.getBoundingClientRect()
	return { x: x - left, y: y - top }
}

@floral
@bindMethods('onTapBack', 'onTapDone', 'onPaintStart', 'onPaintMove')
class EditView extends Component {
	static propTypes = {
		image: PropTypes.instanceOf(ImageData).isRequired,
		onGoBack: PropTypes.func.isRequired,
		onGoNext: PropTypes.func.isRequired
	}

	static styles = (props, state) => {
		const { scale, multiplier, brushSize } = state

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
				backgroundColor: 'white',
				backgroundImage: `url(${bg})`,
				backgroundSize: '30px 30px'
			},
			brush: {
				position: 'absolute',
				width: brushSize * multiplier,
				height: brushSize * multiplier,
				transform: 'translateY(-50%) translateX(-50%)',
				borderRadius: '50%',
				border: '2px solid white',
				filter: 'drop-shadow(1px 1px 2px black)'
			},
			tab: {
				color: 'white'
			},
			bar: {
				display: 'flex',
				padding: '0 24px',
				height: 48
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

		const multiplier = Math.min(
			(SCREEN_HEIGHT - TOP_BAR_HEIGHT - BOTTOM_BAR_HEIGHT) / image.height,
			SCREEN_WIDTH / image.width
		)

		this.state = {
			selectedTab: 'mask',
			paintMasked: false,
			brushSize: 10,
			multiplier,
			scale: 1
		}
	}

	componentDidMount() {
		this.paint()
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.paintMasked !== this.state.paintMasked) this.paint()
	}

	onTapBack() {
		this.props.onGoBack()
	}

	onTapDone() {
		this.props.onGoNext()
	}

	onPaintStart(event, touches) {
		const { image } = this.props
		const coords = touches[0]
		const scale = this.state.scale * this.state.multiplier
		const relCoords = getRelativeCoords(coords, this.canvasRef)
		const imageCoords = getTransformedImageCoords({
			canvas: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
			image,
			scale,
			translate: { x: 0, y: 0 }
		})
		const normCoords = {
			x: (relCoords.x - imageCoords.x) / scale,
			y: (relCoords.y - imageCoords.y) / scale
		}

		this.prevCoords = normCoords
		this.setState({ isPainting: true })
	}

	onPaintMove(event, touches) {
		event.preventDefault()
		const { image } = this.props
		const { erase, brushSize } = this.state
		const { x: x0, y: y0 } = this.prevCoords

		const scale = this.state.scale * this.state.multiplier
		const coords = touches[0]
		const relCoords = getRelativeCoords(coords, this.canvasRef)
		const imageCoords = getTransformedImageCoords({
			canvas: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
			image,
			scale,
			translate: { x: 0, y: 0 }
		})
		const normCoords = {
			x: (relCoords.x - imageCoords.x) / scale,
			y: (relCoords.y - imageCoords.y) / scale
		}

		const ctx = this.maskCanvas.getContext('2d')

		ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over'
		ctx.strokeStyle = 'blue'
		ctx.lineWidth = this.state.multiplier * brushSize
		ctx.lineCap = 'round'
		ctx.beginPath()
		ctx.moveTo(x0, y0)
		ctx.lineTo(normCoords.x, normCoords.y)
		ctx.stroke()

		this.prevCoords = normCoords

		this.brushRef.style.left = `${relCoords.x}px`
		this.brushRef.style.top = `${relCoords.y}px`

		this.paint()
	}

	paint() {
		const { image } = this.props
		const { paintMasked } = this.state
		const ctx = this.canvasRef.getContext('2d')

		// paint image
		ctx.globalAlpha = 1
		ctx.globalCompositeOperation = 'source-over'

		const scale = this.state.scale * this.state.multiplier

		const { x, y, width, height } = getTransformedImageCoords({
			canvas: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
			image,
			scale,
			translate: { x: 0, y: 0 }
		})
		ctx.drawImage(this.imageCanvas, x, y, width, height)

		ctx.globalCompositeOperation = 'destination-out'
		ctx.drawImage(this.maskCanvas, x, y, width, height)

		// paint transparent image
		if (paintMasked) {
			ctx.globalCompositeOperation = 'source-over'
			ctx.globalAlpha = 0.5
			ctx.drawImage(this.imageCanvas, x, y, width, height)
		}
	}

	renderTopBar() {
		const backIcon = (
			<Taply onTap={this.onTapBack}>
				<SvgIcon svg={chevronLeftSvg} style={this.styles.icon} />
			</Taply>
		)

		const doneButton = <FlatButton onClick={this.onTapDone}>Done</FlatButton>

		return (
			<TopBar leftIcon={backIcon} rightIcon={doneButton}>
				Edit
			</TopBar>
		)
	}

	renderMaskTab() {
		return (
			<div style={this.styles.tab}>
				<div style={this.styles.bar}>
					<FlatButton
						label="MASK"
						onClick={() => this.setState({ erase: false })}
					/>
					<FlatButton
						label="UNMASK"
						onClick={() => this.setState({ erase: true })}
					/>
					<FlatButton
						label="SHOW"
						onClick={() =>
							this.setState({ paintMasked: !this.state.paintMasked })
						}
					/>
				</div>
				<div style={this.styles.bar}>
					<Slider
						style={{ width: 150 }}
						sliderStyle={{ margin: 0 }}
						min={5}
						max={25}
						step={1}
						value={this.state.brushSize}
						onChange={(event, value) => this.setState({ brushSize: value })}
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
		const { image } = this.props
		const { isPainting } = this.state

		return (
			<Taply
				onTapStart={this.onPaintStart}
				onTapMove={this.onPaintMove}
				onTapEnd={this.onPaintEnd}
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
					{isPainting && (
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
				{this.renderImage()}
				{this.renderBottomBar()}
			</div>
		)
	}
}

export default EditView
