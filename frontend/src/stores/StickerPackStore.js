import { observable, action } from 'mobx'
import { fromPromise } from 'mobx-utils'

import StickerStore from './StickerStore'

export default class StickerPackStore {
	@observable id
	@observable name
	@observable stickers = []

	@observable fetchStickersResult
	@observable createStickerResult

	constructor(api, { id, name }) {
		this.api = api
		this.id = id
		this.name = name
	}

	@action
	async fetchStickers() {
		this.fetchStickersResult = fromPromise(this.api.getStickers({ id: this.id }))
		this.fetchStickersResult.then(({ stickers }) => {
			this.stickers = stickers.map(sticker => new StickerStore(sticker))
		})
	}

	@action
	async createSticker(data) {
		this.createStickerResult = fromPromise(this.api.stickers.create(data))
		this.createStickerResult.then(({ id }) => {
			this.stickers.push(new StickerStore({ ...data, id }))
		})
	}

	@action
	async edit(edits) {
		// let res = await this.api.editStickerPack(this.id, edits)
	}
}
