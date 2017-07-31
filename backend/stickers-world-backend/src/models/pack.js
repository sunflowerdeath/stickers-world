module.exports = (sequelize, types) => {
  	const Pack = sequelize.define('pack', {
		name: types.STRING
	})

	Pack.associate((models) => {
		Pack.belongsTo(models.User)
		Pack.hasMany(models.Sticker)
	})

	return Pack
}
