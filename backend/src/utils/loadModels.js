const fs = require('fs')
const path = require('path')

module.exports = (sequelize, dir) => {
	let models = {}
	fs
		.readdirSync(dir)
		.forEach(function(file) {
			const model = sequelize.import(path.join(dir, file))
			models[model.name] = model
		})
	Object.keys(models).forEach(function(modelName) {
		if ('associate' in models[modelName]) models[modelName].associate(models)
	})
	return models
}


