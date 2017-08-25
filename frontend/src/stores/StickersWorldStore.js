import {observable, action, runInAction} from 'mobx'
import StickerPackStore from './StickerPackStore'

export default class StickersWorldStore {
	@observable user
	@observable packs = observable.map()
	@observable state = 'ready' // 'ready' / 'loading' / 'error'
	@observable error

	constructor(api) {
		this.api = api
		let {user, packs} = api.getInitialData()
		this.user = user
		if (packs) {
			packs.forEach((pack) => {
				let store = new StickerPackStore(api, pack)
				this.packs.set(pack.id, store)
			})
		}
	}

	@action
	async createStickerPack(data) {
		this.state = 'loading'
		try {
			let {id} = await this.api.createStickerPack(data)
			runInAction(() => {
				this.state = 'ready'
				this.packs.set(id, new StickerPackStore({...data, id}))
			})
		} catch(error) {
			this.state = 'error'
			this.error = error
		}
	}
}
