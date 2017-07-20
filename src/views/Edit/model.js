import {observable} from 'mobx'

export default class EditModel {
	@observable showEffectsPanel = false,
	@observable brushSize = 10
	@observable preview = {
		on: false
		background: 'black'
	}
	@observable effects = {
		border: {
			on: false,
			size: 2,
			maxSize: 10,
			color: '#ccc'
		},
		shadow: {
			on: false,
			size: 2,
			maxSize: 10,
			color: '#ccc'
		}
	}
}
