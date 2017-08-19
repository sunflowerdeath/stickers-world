module.exports = {
	development: {
		client: 'sqlite3',
		debug: true,
		connection: {
			filename: './temp/db.sqlite'
		}
	},

	production: {
		client: 'postgresql',
		connection: {
			database: 'my_db',
			user: 'username',
			password: 'password'
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'knex_migrations'
		}
	}
}
