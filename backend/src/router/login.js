const Router = require('koa-router')

const {knex} = require('../../db')

const router = new Router()

router.get('/:token', async (ctx) => {
	const tokens = await knex('login_tokens').where({token: token})
	ctx.body = {result: 'ok', id}
})

module.exports = router
