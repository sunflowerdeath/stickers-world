module.exports = {
	users: (table) => {
		table.increments()
		table.string('name')
		table.string('telegram_user_id')
		table.string('token')
	},

	packs: (table) => {
		table.increments()
		table.string('name')
		table.integer('user_id')
	},

	stickers: (table) => {
		table.increments()
		table.string('emojis')
		table.string('file')
		table.integer('pack_id')
	}
}
