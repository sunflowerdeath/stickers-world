const Pack = require('./pack')

module.exports = (sequelize, types) => {
	const Sticker = sequelize.define('', {
		emojis: types.STRING,
		file: types.STRING
	})

	Sticker.belongsTo(Pack)
}
