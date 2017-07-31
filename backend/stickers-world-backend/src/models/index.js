module.exports = (sequelize) => {
	sequelize.import('./pack')
	sequelize.import('./user')
	sequelize.import('./sticker')
}
