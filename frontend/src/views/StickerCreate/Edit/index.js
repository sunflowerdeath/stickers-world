import React, { Component } from 'react'
import PropTypes from 'prop-types'
import floral from 'floral'
import Taply from 'taply'

import Slider from 'material-ui/Slider'
import FlatButton from 'material-ui/FlatButton'
import { Tabs, Tab } from 'material-ui/Tabs'

import chevronLeftSvg from '!raw-loader!@@/icons/chevron-left.svg'

import bindMethods from '@@/utils/bindMethods'
import SvgIcon from '@@/components/SvgIcon'
import TopBar from '@@/components/TopBar'

const normalizeCoords = ({ x, y }, elem) => {
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

	static styles = {
		root: {
			display: 'flex',
			flexDirection: 'column',
			height: '100%'
		},
		icon: {
			fill: 'white'
		},
		image: {
			flexGrow: 1,
			background: `linear-gradient(135deg, rgba(216,224,222,1) 0%,rgba(130,157,152,1) 48%,rgba(14,14,14,1) 100%)`
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
	}

	state = {
		selectedTab: 'mask'
	}

	componentDidMount() {
		this.paint()
	}

	onTapBack() {
		this.props.onGoBack()
	}

	onTapDone() {
		this.props.onGoNext()
	}

	onPaintStart(event, touches) {
		const { x, y } = normalizeCoords(touches[0], this.canvasRef)
		this.prevCoords = { x, y }
	}

	onPaintMove(event, touches) {
		const { erase } = this.state
		const { x: x0, y: y0 } = this.prevCoords
		const { x, y } = normalizeCoords(touches[0], this.canvasRef)

		const ctx = this.maskCanvas.getContext('2d')

		ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over'
		ctx.strokeStyle = 'blue'
		ctx.lineWidth = 15
		ctx.lineCap = 'round'
		ctx.beginPath()
		ctx.moveTo(x0, y0)
		ctx.lineTo(x, y)
		ctx.stroke()

		this.prevCoords = { x, y }

		this.paint()
	}

	paint() {
		const { image } = this.props
		const ctx = this.canvasRef.getContext('2d')

		// paint image
		ctx.globalAlpha = 1
		ctx.globalCompositeOperation = 'source-over'
		ctx.putImageData(image, 0, 0)

		// remove masked
		ctx.globalCompositeOperation = 'destination-out'
		ctx.drawImage(this.maskCanvas, 0, 0)

		// paint transparent image
		ctx.globalCompositeOperation = 'source-over'
		ctx.globalAlpha = 0.2
		ctx.drawImage(this.imageCanvas, 0, 0)
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
				<FlatButton
					label="PAINT"
					onClick={() => this.setState({ erase: false })}
				/>
				<FlatButton
					label="ERASE"
					onClick={() => this.setState({ erase: true })}
				/>
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
						width={image.width}
						height={image.height}
					/>
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
