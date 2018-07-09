const Router = require('koa-router')

import User from '../../models/User'
import AuthToken from '../../models/AuthToken'

const router = new Router()

router.post('/create', async ctx => {
	const { name, telegramUserId } = ctx.request.body

	let user = await User.findOne({ where: { telegramUserId }})
	if (!user) {
		user = User.create({ name, telegramUserId })
		await user.save()
	}

	const token = AuthToken.create({ user })
	await token.save()

	ctx.body = { result: 'ok', user, token: token.id }
})

module.exports = router
