import Q from 'q'

const NO_USER_INITIAL_DATA = {
	user: null
}

const USER_INITIAL_DATA = {
	user: {
		name: 'sunflowerdeath'
	},
	packs: [
		{id: '1', name: 'memes'},
		{id: '2', name: 'cats'}
	]
}

const STICKERS = {
	'1': [
		{id: '1', name: 'gnomekid'},
		{id: '2', name: 'moneyface'}
	],
	'2': [
		{id: '3', name: 'cat1'},
		{id: '4', name: 'cat2'}
	]
}

export default {
	getInitialData() {
		return USER_INITIAL_DATA
		// return USER_INITIAL_DATA
	},

	_fakeRequest(response, options) {
		let {error, timeout} = {error: false, timeout: 500, ...options}
		let deferred = Q.defer()
		setTimeout(() => {
			if (error) deferred.reject(response)
			else deferred.resolve(response)
		}, timeout)
		return deferred.promise
	},

	createStickerPack({name, title}) {
		return this._fakeRequest({id: new Date().getTime()})
	},

	getStickers({id}) {
		return this._fakeRequest({stickers: STICKERS[id]})
	},

	editStickerPack({packId, edits}) {
		return this._fakeRequest({ok: true})
	},

	createSticker({packId, name}) {
		return this._fakeRequest({id: new Date().getTime()})
	}
}
