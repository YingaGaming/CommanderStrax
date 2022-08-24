/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";


module.exports.run = async (bot, message, args, data) => {
    try {

        if (!message.member.permissions.has("ADMINISTRATOR")) return bot.tools.sendEmbed(bot, message.channel, {
            description: 'Dir fehlt die Administrator Berechtigung',
            color: '#ff0000'
        })

        if (!message.mentions.members.first()) return bot.tools.sendEmbed(bot, message.channel, {
            description: data.server.prefix + 'strike @User',
            color: '#ff0000'
        })

        let target = await message.mentions.members.first().fetch({ force: true })

        if (target.user.bot) return bot.tools.sendEmbed(bot, message.channel, {
            description: 'Hey! Wir Bots machen nichts böses!',
            color: '#ff0000'
        })

        let currentrole

        for (let i = bot.configs.strikes.roles.length; i > -1; i--) {
            const id = bot.configs.strikes.roles[i];
            if (target.roles.cache.has(id)) {
                currentrole = i
                break
            }
        }


        if (currentrole == undefined) {
            currentrole = -1
        }

        let targetrole = currentrole + 1

        if (targetrole > bot.configs.strikes.roles.length - 1) {
            target.ban({ reason: "Zu viele Strikes" })
                .then(() => {
                    bot.tools.sendEmbed(bot, message.channel, {
                        description: `**${target.user.tag}** wurde aufgrund zu vieler Strikes gebannt`
                    })
                })
                .catch(() => {
                    bot.tools.sendEmbed(bot, message.channel, {
                        description: `<@${target.id}> konnte nicht gebannt werden`,
                        color: '#ff0000'
                    })
                })
        } else {
            target.roles.add(bot.configs.strikes.roles[targetrole])
            bot.tools.sendEmbed(bot, message.channel, {
                description: `<@${target.id}> hat jetzt den ${targetrole + 1}. Strike`
            })
        }


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