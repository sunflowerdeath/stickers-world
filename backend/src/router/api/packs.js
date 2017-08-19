const Router = require('koa-router')

const {knex, bookshelf, models} = require('../../db')
const auth = require('../../middleware/auth')

const router = new Router()

router.post('/', auth, async (ctx) => {
	const packs = await knex('packs').where({'user_id': ctx.user.id})
	// const packs = await models.Pack.where({'user_id': ctx.user.id}).fetchAll()
	ctx.body = {
		result: 'ok',
		packs
	}
})

router.post('/:id', async (ctx) => {
	const {id} = ctx.request.body
	const [pack] = await knex('packs').where({id})
	const stickers = await knex('stickers').where({'pack_id': id})
	pack.stickers = stickers
	ctx.body = {
		result: 'ok',
		pack
	}
})

router.post('/create', auth, async (ctx) => {
	let [id] = await knex('packs').insert({
		'name': ctx.request.body.name,
		'user_id': ctx.user.id
	})
	ctx.body = {result: 'ok', id}
})

module.exports = router
