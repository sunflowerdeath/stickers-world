module.exports = async (knex, schema) => {
	for (let table in schema) {
		await knex.schema.createTableIfNotExists(table, schema[table])
	}
}
