import React from 'react'

import OverlayLayout from '@@/components/OverlayLayout'
import TopBar from '@@/components/TopBar'
import Tappable from '@@/components/Tappable'
import Icon from '@@/components/Icon'

import arrowLeftIcon from '@@/icons/arrowLeft.svg'
import arrowRightIcon from '@@/icons/arrowRight.svg'
import rotateIcon from '@@/icons/rotate.svg'

import AspectSwitcher from './AspectSwitcher'
import AngleSlider from './AngleSlider'

export default AdjustView extends React.Component {
	constructor(props) {
		const {width, height} = this.props

		this.state = {
			aspect: 'Free',
			position: {
				top: (SCREEN_HEIGHT - TOP_BAR_HEIGHT - height) / 2,
				left: (SCREEN_WIDTH - width) / 2
			},
			scale: 1,
			rotation: 0,
			angle: 0,
			crop: {
				top: 0,
				left: 0,
				width,
				height
			}
		}
	}

	render() {
		const {angle, crop, position} = this.state

		let topBar = (
			<TopBar
				leftIcon={<Icon icon={arrowLeftIcon} />}
				onTapLeftIcon={this.props.onGoBack}
				rightIcon={<Icon icon={arrowRightIcon} />
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
				value={angle}
				onChange={(angle) => this.setState({angle})}
			/>
		)

		let imageStyle = {
			position: 'absolute',
			left: position.left,
			top: position.top,
			width: crop.width,
			height: crop.height,
			background: 'white'
		}

		return (
			<OverlayLayout top={topBar} bottom={angleSlider}>
				<div style={imageStyle} />
			</OverlayLayout>
		)
	}

	rotate() {
		let rotation = this.state.rotation === 270 ? 0 : (this.state.rotation + 90)
		this.setState({rotation})
	}
}
