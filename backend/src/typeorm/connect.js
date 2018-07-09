import { createConnection } from 'typeorm'
import { Category, User, AuthToken, Pack, Sticker } from './models'

const connect = () => createConnection({
	type: 'sqlite',
	database: './temp/tdb.sqlite',
	entities: ['dist/models/*.js'],
	synchronize: true
})

export default connect
