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


router.get('/1', () => {
	console.log('GET')
	throw new Error('kek')
})
router.get('/2', () => {
	throw new Error('kek')
})
router.get('/3', ctx => {
	ctx.throw('500', 'message')
})
router.get('/4', ctx => {
	ctx.body = { result: 'error', error: 'validation' }
})
router.get('/5', ctx => {
	ctx.body = { result: 'ok', id: '123' }
})


module.exports = router
