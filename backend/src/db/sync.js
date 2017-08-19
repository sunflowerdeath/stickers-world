module.exports = async (knex) => {
	await knex.schema.createTableIfNotExists('users', (table) => {
		table.increments()
		table.string('name')
		table.string('telegram_user_id')
		table.string('token')
	})

	await knex.schema.db.createTableIfNotExists('packs', (table) => {
		table.increments()
		table.string('name')
		table.string('user_id')
	})

	await knex.schema.createTableIfNotExists('stickers', (table) => {
		table.increments()
		table.string('emojis')
		table.string('file')
		table.string('pack_id')
	})
}
