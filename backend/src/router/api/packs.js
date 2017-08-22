const Router = require('koa-router')

const {knex} = require('../../db')
const auth = require('../../middleware/auth')

const router = new Router()

router.use(auth)

router.post('/', async (ctx) => {
	const packs = await knex('packs').where({'user_id': ctx.user.id})
	ctx.body = {result: 'ok', packs}
})

router.post('/create', async (ctx) => {
	console.log('CREATE', ctx.request.body.name)
	const [id] = await knex('packs').insert({
		'name': ctx.request.body.name,
		'user_id': ctx.user.id
	})
	ctx.body = {result: 'ok', id}
})

router.post('/:id', async (ctx) => {
	const {id} = ctx.request.body
	const [pack] = await knex('packs').where({id})
	const stickers = await knex('stickers').where({'pack_id': id})
	pack.stickers = stickers
	ctx.body = {result: 'ok', pack}
})

module.exports = router
