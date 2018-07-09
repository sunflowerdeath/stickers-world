const Router = require('koa-router')

const {knex} = require('../../db')
import auth from '../../middleware/auth'

const router = new Router()

router.use(auth)

router.get('/:id', async (ctx) => {
	ctx.body = `get sticker ${ctx.params.id}`
})

router.get('/update/:id', async (ctx) => {
	ctx.body = `update sticker ${ctx.params.id}`
})

router.post('/create', async (ctx) => {
	const {emojis, packId} = ctx.request.body

	const [pack] = await knex('packs').select('user_id').where('id', packId)
	if (!pack || pack['user_id'] !== ctx.user.id) {
		ctx.body = {result: 'error', error: 'Can\'t add to this pack'}
		return
	}

	const [id] = await knex('stickers').insert({
		'emojis': ctx.request.body.emojis,
		'pack_id': ctx.request.body.packId,
		'file': 'qwe'
	})
	ctx.body = {result: 'ok', id}
})

module.exports = router
