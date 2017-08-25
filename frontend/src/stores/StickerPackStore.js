import {observable, action, runInAction} from 'mobx'

import StickerStore from './StickerStore'

export default class StickerPackStore {
	@observable id
	@observable name
	@observable stickers
	@observable state = 'initial' // 'initial' / 'loading' / 'ready' / 'error'
	@observable error

	constructor(api, {id, name}) {
		this.api = api
		this.id = id
		this.name = name
	}

	@action
	async getStickers() {
		this.state = 'loading'
		try {
			let {stickers} = await this.api.getStickers({id: this.id})
			runInAction(() => {
				this.stickers = stickers.map((sticker) => new StickerStore(sticker))
				this.state = 'ready'
			})
		} catch(error) {
			this.state = 'error'
			this.error = error
		}
	}

	@action
	async createSticker(data) {
		this.state = 'loading'
		try {
			let {id} = await this.api.createSticker(data)
			runInAction(() => {
				this.stickers.push(new StickerModel({...data, id}))
				this.state = 'ready'
			})
		} catch(error) {
			this.state = 'error'
			this.error = error
		}
	}

	@action
	async edit(edits) {
		let res = await this.api.editStickerPack(this.id, edits)
	}
}
