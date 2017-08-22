const NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('../../knexfile')
const syncSchema = require('../utils/syncSchema')
const schema = require('./schema')
const knex = require('knex')(config[NODE_ENV])

module.exports = {
	knex,
	syncSchema: async () => await syncSchema(knex, schema)
}
