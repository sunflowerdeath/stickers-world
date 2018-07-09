const Router = require('koa-router')

const {knex} = require('../../db')
import auth from '../../middleware/auth'
import StickerPack from '../../models/StickerPack'

const router = new Router()

router.use(auth)

router.get('/', async ctx => {
	const packs = await StickerPack.find({
		where: { user: ctx.user }
	})
	ctx.body = { result: 'ok', packs }
})

router.post('/create', async ctx => {
	const pack = StickerPack.create({
		name: ctx.request.body.name,
		user: ctx.user
	})
	await pack.save()
	ctx.body = { result: 'ok', id: pack.id }
})

router.post('/remove/:id', async ctx => {
	await Pack.removeById(id)
	ctx.body = { result: 'ok' }
})

router.post('/:id', async (ctx) => {
	const {id} = ctx.request.body
	const [pack] = await knex('packs').where({id})
	const stickers = await knex('stickers').where({'pack_id': id})
	pack.stickers = stickers
	ctx.body = {result: 'ok', pack}
})

module.exports = router
