const Sticker = require('./sticker')
const User = require('./user')

module.exports = (sequelize, types) => {
  	const Pack = sequelize.define('pack', {
		name: types.STRING
	})

	Pack.belongsTo(User)
	Pack.hasMany(Sticker)

	return Pack
}
