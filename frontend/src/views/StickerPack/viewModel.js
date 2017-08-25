import {observable, computed} from 'mobx'

export default class StickerPackViewModel {
	constructor(model) {
		this.model = model
	}

	@observable editing = false
	@observalbe loading = false
	@observable editedStickers

	@computed stickers() {
		return this.state.editing ? this.editedStickers : this.model.stickers
	}

	startEditing() {
		this.editing = true
		this.editedStickers = [...this.model.stickers]
		this.edits = []
	}

	deleteSticker(id) {
		let index = this.editedStickers.findIndex((sticker) => sticker.id === id)
		this.editedStickers.splice(index, 1)
		this.edits.push({type: 'delete', id}) 
	}

	moveSticker() {
	}

	commitEdits: async () => {
		this.loading = true
		try {
			await api.editStickerPack(this.edits)
		} catch(error) {
			this.error = error
		}
		this.loading = false
		this.editing = false
	}
}
