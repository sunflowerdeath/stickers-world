module.exports = (sequelize, types) => {
  	const Pack = sequelize.define('Pack', {
		name: types.STRING
	})

	Pack.associate = (models) => {
		Pack.belongsTo(models.User)
		Pack.hasMany(models.Sticker)
	}

	return Pack
}
