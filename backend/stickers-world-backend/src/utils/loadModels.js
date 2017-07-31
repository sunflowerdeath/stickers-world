const fs = require('fs')
const path = require('path')

module.exports = (sequelize, dir) => {
	let models = {}
	fs
		.readdirSync(dir)
		.forEach(function(file) {
			models[model.name] = sequelize.import(path.join(dir, file))
		})
	Object.keys(models).forEach(function(modelName) {
		if ('associate' in models[modelName]) models[modelName].associate(models)
	})
}


