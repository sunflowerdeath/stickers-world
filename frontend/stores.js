class StickerStore {
	@observable emojis = []

	constructor({emojis}) {
		this.emojis = emojis
	}
}

class StickerPackStore {
	@observable id = []
	@observable stickers = []

	constructor({id, stickers}) {
		this.id = id
		this.packs = packs.map((pack) => new StickerPackModel(pack))
	}

	createSticker: async (data) => {
		try {
			let {id} = await api.createStickerPack(data)
		} catch(error) {
			return // hui znaet chto
		}
		this.stickerPacks.push(new StickerPackModel({...data, id}))
		// vsyo ok
	}

	edit: async (edits) => {
		let res = await this.api.editStickerPack(this.id, edits)
	}
}

class AppStore {
	@observable user
	@observable packs = []

	constructor({user, packs}) {
		this.user = user
		this.packs = packs.map((pack) => new StickerPackModel(pack))
	}

	createStickerPack: async (data) => {
		try {
			let {id} = await api.createStickerPack(data)
		} catch(e) {
			// error
		}
		this.stickerPacks.push(new StickerPackModel({...data, id}))
	}
}
