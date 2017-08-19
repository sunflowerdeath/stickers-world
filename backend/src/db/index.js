const NODE_ENV = process.env.NODE_ENV || 'development'
const config = require('../../knexfile')
const syncSchema = require('../utils/syncSchema')
const schema = require('./schema')
const knex = require('knex')(config[NODE_ENV])
const bookshelf = require('bookshelf')(knex)
bookshelf.plugin('registry')

const User = bookshelf.model('User', {
  tableName: 'users',
  packs() { return this.hasMany('Pack') }
})

const Pack = bookshelf.model('Pack', {
  tableName: 'packs',
  stickers() { return this.hasMany('Sticker') },
  user() { return this.belongsTo('User') }
})

const Sticker = bookshelf.model('Sticker', {
  tableName: 'stickers'
  // pack: () => this.hasMany('Pack')
})

module.exports = {
	knex,
	bookshelf,
	syncSchema: async () => await syncSchema(knex, schema),
	models: {
		User, Pack, Sticker
	}
}
