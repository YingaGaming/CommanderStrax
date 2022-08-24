/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";

const ms = require('ms')

module.exports = async (bot, member) => {

    bot.tools.updateStats(bot)

    bot.tools.sendEmbed(bot, bot.guild.channels.resolve(bot.configs.logs.members), {
		description: `${bot.configs.emoji.red_minus} **${member.user.tag}**`,
		color: '#FF0000'
	})
	
};