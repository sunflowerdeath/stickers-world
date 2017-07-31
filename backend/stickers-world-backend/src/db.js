const Sequelize = require('sequelize')

const config = require('./config/db.js')
const loadModels = require('./utils/loadModels')

const {database, username, password, ...restConfig} = config

const sequelize = new Sequelize(database, username, password, {
	...restConfig,
	define: {
		underscore: true
	}
})

loadModels(sequelize, path.join(__dirname, 'models')

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
