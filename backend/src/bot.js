let uuid = require('uuid')
let TelegramBot = require('node-telegram-bot-api')
let SECRETS = require('../SECRETS')

let {knex} = require('./db')

let bot = new TelegramBot(SECRETS.token, {polling: true})

let getUser = async (message) => {
	let [user] = await knex('users').where('telegram_user_id', message.from.id)
	return user
}

let createNewUser = async (message) => {
	let user = {
		telegram_user_id: message.from.id,
		name: message.from.username,
		token: uuid()
	}
	let [id] = await knex('users').insert(user)
	user.id = id
	return user
}

let catchErrors = (handler) => (message, match) => {
	handler(message, match).catch((err) => {
		return bot.sendMessage(message.chat.id, `Unexpected server error: ${err}`)
	})
}

let start = async (message) => {
	let user = await getUser(message)
	if (!user) user = await createNewUser(message)
	let url = `/api/init/${user.token}`
	await bot.sendMessage(message.chat.id, `Your profile have been created. Navigate to ${url}`)
}

bot.onText(/^\/start$/, catchErrors(start))
