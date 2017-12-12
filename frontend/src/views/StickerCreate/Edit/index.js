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

@floral
@bindMethods('onTapBack', 'onTapDone')
class EditView extends Component {
	static propTypes = {
		image: PropTypes.any.isRequired,
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
			flexGrow: 1
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

	state = {
		selectedTab: 'mask'
	}

	onTapBack() {
		this.props.onGoBack()
	}

	onTapDone() {
		this.props.onGoNext()
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
		return <div style={this.styles.tab}>MASK</div>
	}

	renderEffectsTab() {
		return <div style={this.styles.tab}>
			<div style={this.styles.bar}>
				<b>BORDER</b>
				<Slider style={{width: 150}} sliderStyle={{margin: 0}}/>
			</div>
			<div style={this.styles.bar}>
				<b>SHADOW</b>
				<Slider style={{width: 150}} sliderStyle={{margin: 0}}/>
			</div>
			</div>
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

	render() {
		return (
			<div style={this.styles.root}>
				{this.renderTopBar()}
				<div style={this.styles.image} />
				{this.renderBottomBar()}
			</div>
		)
	}
}

export default EditView
