const Koa = require('koa')

const serverConfig = require('./config').server
const {knex, syncSchema} = require('./db')
const router = require('./router')

const app = new Koa()
app.use(router.routes())

syncSchema()
	.then(() => {
		let {port, hostname} = serverConfig
		app.listen(port, hostname)
		console.error(`Server is listening on port ${port}`)
	})
	.catch((err) => {
		console.error('Unable to connect to the database:', err)
	})
