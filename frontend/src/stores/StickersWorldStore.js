import {observable, action, when} from 'mobx'
import {fromPromise} from 'mobx-utils'

import StickerPackStore from './StickerPackStore'

export default class StickersWorldStore {
	@observable user
	@observable packs = observable.map()
	@observable createResult

	constructor(api) {
		this.api = api
		const {user, packs} = api.getInitialData()
		this.user = user
		if (packs) {
			packs.forEach(pack => {
				const store = new StickerPackStore(api, pack)
				this.packs.set(pack.id, store)
			})
		}

		when(
			() => this.createResult && this.createResult.state === 'fulfulled',
			() => {
				const {value: {id}, data} = this.createResult
				this.packs.set(id, new StickerPackStore({...data, id}))
			}
		)
	}

	@action
	async createStickerPack(data) {
		this.createResult = fromPromise(this.api.createStickerPack(data))
		this.createResult.data = data
	}
}
