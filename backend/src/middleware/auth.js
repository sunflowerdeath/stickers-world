const {knex} = require('../db')

module.exports = async (ctx, next) => {
	let user = await knex('users')
		.where({token: ctx.request.body.token})
		.first()
	if (user) {
		ctx.user = user
		await next()
	} else {
		ctx.body = {result: 'error', error: 'invalid user token'}
	}
}
