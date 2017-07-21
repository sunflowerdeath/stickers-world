import React from 'react'

import OverlayLayout from '@@/components/OverlayLayout'
import TopBar from '@@/components/TopBar'
import Tappable from '@@/components/Tappable'
import Icon from '@@/components/Icon'

import arrowLeftIcon from '!raw-loader!@@/icons/arrowLeft.svg'
import arrowRightIcon from '!raw-loader!@@/icons/arrowRight.svg'
import rotateIcon from '!raw-loader!@@/icons/rotate.svg'

import AspectSwitcher from './AspectSwitcher'
import AngleSlider from './AngleSlider'

import patrick from '!file-loader!@@/patrick.jpg'

const SCREEN_WIDTH = document.documentElement.clientWidth
const SCREEN_HEIGHT = document.documentElement.clientHeight
const TOP_BAR_HEIGHT = 50
const BOTTOM_PANEL_HEIGHT = 90

export default class AdjustView extends React.Component {
	constructor(props) {
		super()

		const {width, height} = props

		this.state = {
			aspect: 'rect',
			crop: {
				top: 50,
				left: 50,
				width: width - 100,
				height: height - 100,
				angle: 0
			}
		}
	}

	// For given crop, calculate image transform, such that crop frame is positioned 
	// at the center of the screen with 20px margin to edges
	getStyles(crop) {
		let {width, height} = this.props

		let horizScale = (SCREEN_WIDTH - 20 * 2) / crop.width
		let vertScale = (SCREEN_HEIGHT - TOP_BAR_HEIGHT - BOTTOM_PANEL_HEIGHT - 20 * 2) /
			crop.height
		let scale = Math.min(horizScale, vertScale)

		let frameWidth = crop.width * scale
		let frameHeight = crop.height * scale
		let top = (SCREEN_HEIGHT - TOP_BAR_HEIGHT - frameHeight) / 2
		let left = (SCREEN_WIDTH - frameWidth) / 2

		return {
			frame: {
				position: 'absolute',
				width: frameWidth,
				height: frameHeight,
				transform: [
					`translateY(${top}px)`,
					`translateX(${left}px)`
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
				willChange: 'transform, width, height',
				backgroundImage: `url(${patrick})`,
				backgroundSize: '100% 100%'
			}
		}
	}

	render() {
		const {width, height} = this.props
		const {crop} = this.state

		let topBar = (
			<TopBar
				leftIcon={<Icon icon={arrowLeftIcon} />}
				onTapLeftIcon={this.props.onGoBack}
				rightIcon={<Icon icon={arrowRightIcon} />}
				onTapRightIcon={this.props.onGoNext}
			>
				<div>Crop photo</div>
				<AspectSwitcher
					value={this.state.aspect}
					onChange={(aspect) => this.setState({aspect})}
				/>
				<Tappable onTap={this.rotate.bind(this)}>
					<Icon icon={rotateIcon} />
				</Tappable>
			</TopBar>
		)

		let angleSlider = (
			<AngleSlider
				value={crop.angle}
				onChange={this.onChangeAngle.bind(this)}
			/>
		)

		let container = {
			width: '100%',
			height: '100%',
			overflow: 'hidden',
			position: 'absolute'
		}

		let styles = this.getStyles(this.state.crop)

		return (
			<OverlayLayout top={topBar} bottom={angleSlider} >
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
	}

	onPanMove({dx, dy, event}) {
		let {left, top} = this.initialCrop
		this.setState({
			crop: {
				...this.state.crop,
				left: left - dx / 2, // TODO divide by scale
				top: top - dy / 2
			}
		})
	}

	rotate() {
		let rotation = this.state.rotation === 270 ? 0 : (this.state.rotation + 90)
		this.setState({rotation})
	}

	onChangeAngle(angle) {
		let {width, height} = this.props
		this.setState({
			crop: {
				...this.state.crop,
				angle
			}
		})
	}
}
