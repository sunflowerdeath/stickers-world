module.exports = (sequelize, types) => {
	const User = sequelize.define('User', {
		name: types.STRING,
		telegramUserId: {type: types.STRING, field: 'telegram_user_id'},
		token: types.STRING
	})

	User.associate = (models) => {
		User.hasMany(models.Pack)
	}

	return User
}
