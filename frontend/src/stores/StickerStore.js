import {observable} from 'mobx'

export default class StickerStore {
	@observable emojis = []

	constructor({emojis}) {
		this.emojis = emojis
	}
}
