import React from 'react'

import PanelRow from '@@/components/PanelRow'
import Switcher from '@@/components/Switcher'
import Slider from '@@/components/Slider'
import ColorPicker from '@@/components/ColorPicker'

export default class BorderEffectRow extends ReactComponent {
	render() {
		let {model, name} = this.props

		return (
			<PanelRow>
				{name}
				<Switcher value={model.on} onChange={(value) => model.on = value} />

				Size
				<Slider
					disabled={!model.on}
					max={model.maxSize}
					value={model.size}
					onChange={(value) => model.size = value}
				/>

				Color
				<ColorPicker
					disabled={!model.on}
					value={model.color}
					onChange={(value) => model.color = color}
				/>
			</PanelRow>
		)
	}
}
