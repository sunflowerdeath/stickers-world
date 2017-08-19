const Router = require('koa-router')
const koaBody = require('koa-body')

const packs = require('./packs')
const stickers = require('./stickers')
const users = require('./users')

const router = new Router()

router
	.use(koaBody())
	.use('/packs', packs.routes())
	.use('/stickers', stickers.routes())
	.use('/users', users.routes())

module.exports = router
