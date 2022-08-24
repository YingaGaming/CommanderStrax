/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";

const ms = require('ms')

module.exports = async (bot) => {

	bot.guild = await bot.guilds.fetch(bot.configs.general.guild)

    console.log('> ready')
    console.log(`> invite link: https://discordapp.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot`)

    require('../handlers/captcha.js').start(bot)
	require('../handlers/yt_notify.js').init(bot)

	if(bot.guild.voice && bot.guild.voice.connection){
		bot.guild.voice.connection.disconnect()
	}

    let activityIndex = 0

    setInterval(() => {

		bot.db.query('Servers', {id: bot.guild.id}, res => {
			if(!res[0])return

			bot.user.setActivity(
				bot.configs.general.activities[activityIndex].name
					.split('%prefix%').join(res[0].prefix)
				, {
				type: bot.configs.general.activities[activityIndex].type
			})
	
			activityIndex++
	
			if(!bot.configs.general.activities[activityIndex])activityIndex = 0

		})

	}, 15000)

	bot.tools.refreshTicketMessage(bot)

	setInterval(() => {
		bot.tools.purgeTickets(bot)
	}, 30000)

	setInterval(() => {
		bot.tools.refreshTicketMessage(bot)
	}, ms('24h'))

	bot.tools.refreshCaptchaMessage(bot)
	
	setInterval(() => {
		bot.tools.refreshCaptchaMessage(bot)
	}, ms('24h'))

	bot.tools.updateStats(bot)
	setInterval(() => {
		bot.tools.updateStats(bot)
	}, ms('10m'))

};