/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";


module.exports.run = async (bot, message, args, data) => {
    try {

        if(!message.member.permissions.has("ADMINISTRATOR"))return bot.tools.sendEmbed(bot, message.channel, {
			description: 'Dir fehlt die Administrator Berechtigung',
			color: '#ff0000'
		})

		if(!args[0])return bot.tools.sendEmbed(bot, message.channel, {
			description: data.server.prefix + 'prefix <neuer prefix>',
			color: '#ff0000'
		})

		bot.db.update('Servers', {id: message.guild.id}, {prefix: args.join(' ')}, s => {
			bot.tools.sendEmbed(bot, message.channel, {
				description: `Der neue Prefix ist **${args.join(' ')}**`
			})
		})

    } catch (error) {
        bot.tools.sendEmbed(bot, message.channel, {
            title: 'Whoops',
            description: 'Some kind of error just happened. I have informed my developer!',
            color: '#ff0000'
        })

        bot.tools.sendError(bot, message, error)
    }
}

module.exports.info = {
    alias: []
}