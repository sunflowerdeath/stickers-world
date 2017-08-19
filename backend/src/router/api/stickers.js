const Router = require('koa-router')

const {knex} = require('../../db')
const router = new Router()

router.get('/:id', async (ctx) => {
	ctx.body = `get sticker ${ctx.params.id}`
})

router.get('/update/:id', async (ctx) => {
	ctx.body = `update sticker ${ctx.params.id}`
})

router.post('/create', async (ctx) => {
	let [id] = await knex('stickers').insert({
		'emojis': ctx.request.body.emojis,
		'pack_id': ctx.request.body.packId,
		'file': 'qwe'
	})
	ctx.body = {result: 'ok', id}
})

module.exports = router
