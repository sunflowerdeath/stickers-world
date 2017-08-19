module.exports = (sequelize, types) => {
	const Sticker = sequelize.define('Sticker', {
		emojis: types.STRING,
		file: types.STRING
	})

	Sticker.associate = (models) => {
		Sticker.belongsTo(models.Pack)
	}

	return Sticker
}
