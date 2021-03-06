const path = require('path')
const Sequelize = require('sequelize')
const decamelize = require('decamelize')

const dbConfig = require('./config').db
const loadModels = require('./utils/loadModels')

const {database, username, password} = dbConfig
const config = Object.assign({}, dbConfig, {
	define: {
		underscored: true, // autogenerated fields
		underscoredAll: true, // model names
	}
})
const sequelize = new Sequelize(database, username, password, config)

let models = loadModels(sequelize, path.join(__dirname, 'models'))
module.exports = {sequelize, Sequelize, models}
