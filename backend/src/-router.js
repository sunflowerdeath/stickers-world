const Router = require('koa-router')
const send = require('koa-send')
const conditional = require('koa-conditional-get');
const etag = require('koa-etag')

const {sequelize} = require('./db')

const router = new Router()

router.get('/', conditional(), etag(), async (ctx) => {
	await send(ctx, 'static/index.html')
})

router.get('/static/:path', conditional(), etag(), async (ctx) => {
	await send(ctx, this.params.path, {root: __dirname + '/static'})
})

router.get('/test', async (ctx) => {
	console.log('Received request for URL: ' + ctx.request.url)
	// response.writeHead(200)

	let err, result
	try {
		result = await sequelize.query('SELECT 1 + 1 AS solution')
	} catch(e) {
		err = true
		ctx.body = 'Error: ' + e
	}
	if (!err) ctx.body = 'ThE SOLUTION is: ' + JSON.stringify(result)
})

module.exports = router
