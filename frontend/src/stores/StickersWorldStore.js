import { observable, action } from 'mobx'
import { fromPromise } from 'mobx-utils'

import StickerPackStore from './StickerPackStore'

class NotificationContext {
	create(message) {
		alert(message)
	}
}

class StickersWorldStore {
	@observable user
	@observable packs = {}

	@observable createPackResult

	constructor(api) {
		this.api = api
		const { user, packs } = api.getInitialData()
		this.user = user
		if (packs) {
			packs.forEach(pack => {
				this.packs[pack.id] = new StickerPackStore(api, pack)
			})
		}
		this.notificationContext = new NotificationContext()
	}

	@action
	async createPack(data, history) {
		this.createPackResult = fromPromise(this.api.createStickerPack(data))
		this.createPackResult.then(
			({ id }) => {
				this.packs[id] = new StickerPackStore(this.api, { ...data, id })
				history.push(`/packs/${id}`)
			},
			() => this.notificationContext.create('Failed to create sticker pack.')
		)
	}

	@action
	logout() {
		this.user = undefined
	}
}

export default StickersWorldStore
