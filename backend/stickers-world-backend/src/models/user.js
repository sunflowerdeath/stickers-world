module.exports = (sequelize, types) => {
	const User = sequelize.define('User', {
		name: types.STRING,
		telegramUserId: types.STRING,
	})

	User.associate((models) => {
		User.hasMany(models.Pack)
	})

	return User
})
