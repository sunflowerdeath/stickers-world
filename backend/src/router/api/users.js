const Router = require('koa-router')

const {knex} = require('../../db')

const router = new Router()

router.post('/create', async (ctx) => {
	let user = await knex('users').insert({
		name: ctx.request.body.name,
		token: ctx.request.body.token
	})
	ctx.body = {result: 'ok', id: user.id}
})

module.exports = router
