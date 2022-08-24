/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";

const generator = require('unique-username-generator')


module.exports.run = async (bot, message, args, data) => {
    try {

        if (!message.member.permissions.has("MANAGE_NICKNAMES")) return bot.tools.sendEmbed(bot, message.channel, {
            description: 'Dir fehlt die "Manage Nicknames" Berechtigung',
            color: '#ff0000'
        })

        if(!args[0])return bot.tools.sendEmbed(bot, message.channel, {
            description: data.prefix + 'namegen <@User oder ID>',
            color: '#ff0000'
        })

        let target

        if(!message.mentions.members.first()){
            target = message.guild.members.resolve(args[0])
        }else{
            target = message.mentions.members.first()
        }

        if(!target)return bot.tools.sendEmbed(bot, message.channel, {
            description: 'Ungültiges Mitglied',
            color: '#ff0000'
        })

        target.setNickname(generator.generateUsername("", 3, 16), 'namegen')
            .then(() => {
                bot.tools.sendEmbed(bot, message.channel, {
                    description: `<@${target.id}> wurde umbenannt`
                })
            })
            .catch(() => {
                bot.tools.sendEmbed(bot, message.channel, {
                    description: `<@${target.id}> konnte nicht umbenannt werden`,
                    color: '#ff0000'
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