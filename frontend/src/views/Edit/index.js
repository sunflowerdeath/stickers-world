import React from 'react'
import {observer} from 'mobx-react'

import OverlayLayout from '@@/components/OverlayLayout'
import TopBar from '@@/components/TopBar'
import Tappable from '@@/components/Tappable'
import Icon from '@@/components/Icon'
import PanelRow from '@@/components/PanelRow'
import ColorPicker from '@@/components/ColorPicker'
import Slider from '@@/components/Slider'

import arrowLeftIcon from '!raw-loader!@@/icons/arrowLeft.svg'
import arrowUpIcon from '!raw-loader!@@/icons/arrowUp.svg'
import checkmarkIcon from '!raw-loader!@@/icons/checkmark.svg'

import EditModel from './model'

const MIN_BRUSH_SIZE = 3
const MAX_BRUSH_SIZE = 30

@observer
export default class EditView extends React.Component {
	constructor() {
		super()
		this.model = new EditModel()
	}

	render() {
		return (
			<OverlayLayout
				top={this.renderTopBar()}
				bottom={this.renderBottomPanel()}
			>
				{this.renderCanvas()}
			</OverlayLayout>
		)
	}

	renderTopBar() {
		return (
			<TopBar
				leftIcon={<Icon icon={backIcon} />}
				onTapLeftIcon={this.props.onGoBack}
				rightIcon={<Icon icon={completedIcon} />}
				onTapRightIcon={this.props.onComplete}
			>
				Edit
			</TopBar>
		)
	}


	renderBottomPanel() {
		let model = this.model
		return (
			<div>
				{model.showEffectsPanel ? null : this.renderPaintPanel()}
				<PanelRow>
					Effects
					<Tappable onTap={() => model.showEffectsPanel = !model.showEffectsPanel}>
						<Icon icon={arrowUpIcon} />
					</Tappable>
				</PanelRow>
				{model.showEffectsPanel ? this.renderEffectsPanel() : null}
			</div>
		)
	}

	renderPaintPanel() {
		let model = this.model
		return (
			<div>
				<PanelRow>
					Paint | Erase
					<Slider
						min={MIN_BRUSH_SIZE}
						max={MAX_BRUSH_SIZE}
						value={model.brushSize}
						onChange={(value) => model.brushSize = value}
					/>
				</PanelRow>
				<PanelRow>
					Preview
					<Switcher
						value={model.preview.on}
						onChange={(value) => mode.preview.on = value}
					/>
					<BackgroundSelector
						value={model.preview.background}
						onChange={(value) => model.preview.background = value}
					/>
				</PanelRow>
			</div>
		)
	}

	renderEffectsPanel() {
		return (
			<div>
				<BorderEffectRow name='Border' model={this.model.effects.border} />
				<BorderEffectRow name='Shadow' model={this.model.effects.shadow} />
			</div>
		)
	}

	renderCanvas() {
		return <div/>
	}
}

