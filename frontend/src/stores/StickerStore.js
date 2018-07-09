import { observable } from 'mobx'

export default class StickerStore {
	@observable id
	@observable emojis

	constructor({ id, emojis }) {
		this.id = id
		this.emojis = emojis
	}
}
