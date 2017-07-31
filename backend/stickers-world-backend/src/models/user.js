const Pack = require('./pack')

module.exports = (sequelize, types) => {
	const User = sequelize.define('project', {
		name: types.STRING,
		telegramUserId: types.STRING,
	})

	User.hasMany(Pack)

	return User
})
