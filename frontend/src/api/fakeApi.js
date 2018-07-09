import Q from 'q'

const NO_USER_INITIAL_DATA = {
	user: null
}

const USER_INITIAL_DATA = {
	user: {
		name: 'sunflowerdeath'
	},
	packs: [{ id: '1', name: 'memes' }, { id: '2', name: 'cats' }]
}

const STICKERS = {
	'1': [{ id: '1', name: 'gnomekid' }, { id: '2', name: 'moneyface' }],
	'2': []
}

export default {
	getInitialData() {
		return USER_INITIAL_DATA
		// return NO_USER_INITIAL_DATA
	},

	fakeRequest(response, options) {
		const { error, timeout } = { error: false, timeout: 800, ...options }
		const deferred = Q.defer()
		setTimeout(() => {
			if (error) deferred.reject(response)
			else deferred.resolve(response)
		}, timeout)
		return deferred.promise
	},

	createStickerPack(/* {name, title} */) {
		if (window.__FAIL__) return this.fakeRequest({}, { error: true })
		return this.fakeRequest({ id: new Date().getTime() })
	},

	checkStickerPackName(name) {
		return this.fakeRequest({ qwe: name === 'test' })
	},

	getStickers({ id }) {
		return this.fakeRequest({ stickers: STICKERS[id] })
	},

	editStickerPack(/* {packId, edits} */) {
		return this.fakeRequest({ ok: true })
	},

	createSticker(/* {packId, name} */) {
		return this.fakeRequest({ id: new Date().getTime() })
	}
}
