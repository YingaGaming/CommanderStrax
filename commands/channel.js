/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";


module.exports.run = async (bot, message, args, data) => {
    try {

        if(!message.member.voice?.channel)return bot.tools.sendEmbed(bot, message.channel, {
            description: 'Du bist nicht in einem Sprachkanal',
            color: '#ff0000'
        })

        bot.db.query('PrivateChannels', {id: message.member.voice.channel.id}, res => {
            let channelData = res[0]

            if(!channelData)return bot.tools.sendEmbed(bot, message.channel, {
                description: 'Das ist kein privater Sprachkanal',
                color: '#ff0000'
            })

            if(channelData.author != message.member.id)return bot.tools.sendEmbed(bot, message.channel, {
                description: 'Du bist nicht der Ersteller dieses Kanals',
                color: '#ff0000'
            })

            if(!args[0])return bot.tools.sendEmbed(bot, message.channel, {
                description: data.prefix + 'channel <name | whitelist>',
                color: '#ff0000'
            })

            let cmd = args[0].toLowerCase()
            args.shift()

            let channel = message.member.voice.channel

            switch (cmd) {
                case "name":
                    channel.setName(args.join(' '))
                    bot.tools.sendEmbed(bot, message.channel, {
                        description: `Kanal umbenannt zu **${args.join(' ')}**`
                    })
                    break;
            
                default:
                    bot.tools.sendEmbed(bot, message.channel, {
                        description: data.prefix + 'channel <name | whitelist>',
                        color: '#ff0000'
                    })
                    break;
            }

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