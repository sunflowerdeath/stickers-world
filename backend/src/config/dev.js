let path = require('path')

module.exports = {
	server: {
		hostname: '0.0.0.0',
		port: 8080
	},
	db: {
		dialect: 'sqlite',
		host: 'mysql',
		storage: path.join(__dirname, '../../temp/db.sqlite')
	}
}
