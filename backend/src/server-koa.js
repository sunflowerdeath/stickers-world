console.log('SERVER')

const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')

const app = new Koa()
console.log('server')

// DB
let users = [
	{
		id: '1',
		name: 'sunflowerdeath',
		token: 'SUNFLOWER'
	},
	{
		id: '2',
		name: 'testuser',
		token: 'QWE'
	}
]

let packs = [
	{
		user: '1',
		name: '1-test'
	},
	{
		user: '2',
		name: '2-test'
	}
]

let stickers = {
	'1': {
		pack: '1',
		emoji: ':)'
	}
}

app.use(koaBody())


// ROUTES
var fs = require('fs')
var path = require('path')

const router = new Router()

let auth = async (ctx, next) => {
	let user = users.find((user) => user.token === ctx.request.body.token)
	if (user) {
		ctx.user = user
		await next()
	} else {
		ctx.body = {result: 'error', error: 'invalid user token'}
	}
}

router.get('/', (ctx) => {
	ctx.set('Content-type', 'text/html')
	ctx.body = fs.readFileSync(__dirname + '/index.html')
})

router.post('/packs', auth, (ctx) => {
	let userPacks = packs.filter((pack) => pack.user === ctx.user.id)
	ctx.body = {
		result: 'ok',
		packs: userPacks
	}
})

router.post('/packs/create', auth, (ctx) => {
	packs.push({
		id: new Date().getTime(),
		name: ctx.request.body.name,
		user: ctx.user.id
	})
	ctx.body = {result: 'ok'}
})

app.use(router.routes())
app.listen(80)
