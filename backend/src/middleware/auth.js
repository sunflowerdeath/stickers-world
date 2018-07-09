import AuthToken from '../models/AuthToken'

export default async (ctx, next) => {
	console.log(ctx.request.headers)
	const token = await AuthToken.findOne({
		where: {
			id: ctx.request.headers['authorization-token']
		},
		relations: ['user']
	})

	if (token) {
		ctx.user = token.user
		await next()
	} else {
		ctx.body = { result: 'error', error: 'Invalid auth token' }
	}
}
