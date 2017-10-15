import {observable, computed, when} from 'mobx'
// import {fromPromise} from 'mobx-utils'

export default class StickerPackViewModel {
	@observable commitResult
	@observable editing = false
	@observable editedStickers

	@computed
	stickers() {
		return this.state.editing ? this.editedStickers : this.model.stickers
	}

	constructor(model, api) {
		this.api = api
		this.model = model

		when(
			() => this.commitResult && this.commitResult.fulfilled,
			() => {
				this.editing = false
			}
		)
	}

	startEditing() {
		this.editing = true
		this.editedStickers = [...this.model.stickers]
		this.edits = []
	}

	deleteSticker(id) {
		const index = this.editedStickers.findIndex(sticker => sticker.id === id)
		this.editedStickers.splice(index, 1)
		this.edits.push({type: 'delete', id})
	}

	moveSticker() {}

	commit() {
		this.commitResult = fromPromise(api.editStickerPack(this.edits))
	}
}
