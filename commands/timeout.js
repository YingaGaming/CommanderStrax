/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";

const ms = require('ms')

module.exports.run = async (bot, message, args, data) => {
    try {

        let play = (connection) => {
            let dispatcher = connection.play(require("path").join(__dirname, '../timeout.mp3'))

            dispatcher.on('finish', () => {

                if(connection.channel.members.size < 2){
                    connection.disconnect()
                }else{
                    play(connection)
                }

            })

            dispatcher.on('error', (err) => {
                console.error(err)
                connection.disconnect()
            })
        }

        if (!message.member.permissions.has("ADMINISTRATOR")) return bot.tools.sendEmbed(bot, message.channel, {
            description: 'Dir fehlt die Administrator Berechtigung',
            color: '#ff0000'
        })

        if (!message.mentions.members.first()) return bot.tools.sendEmbed(bot, message.channel, {
            description: data.server.prefix + 'timeout @User',
            color: '#ff0000'
        })

        let target = message.mentions.members.first()

        if (target.user.bot) return bot.tools.sendEmbed(bot, message.channel, {
            description: 'Das ist ein Bot. Mit dem mach ich das nicht. Kann zu Komplikationen führen.',
            color: '#ff0000'
        })

        if (!target.voice.channel) return bot.tools.sendEmbed(bot, message.channel, {
            description: `<@${target.id}> ist nicht in einem Sprachkanal`,
            color: '#ff0000'
        })

        let originalChannel = target.voice.channel

        let channel = message.guild.channels.resolve(bot.configs.timeout.channel)

        bot.tools.sendEmbed(bot, message.channel, {
            description: `<@${target.id}> beruhigt sich jetzt erstmal`
        })

        await target.roles.add(bot.configs.timeout.role)
        target.voice.setChannel(channel)

        if (message.guild.voice && message.guild.voice.connection) {
            //play(message.guild.voice.connection)
        }else{
            channel.join()
                .then(connection => {
                    play(connection)
                })
        }

        setTimeout(async () => {
            await target.roles.remove(bot.configs.timeout.role)
            if (target.voice.channel == channel) target.voice.setChannel(originalChannel)

            // if (message.guild.voice && message.guild.voice.connection) {
            //     message.guild.voice.connection.disconnect()
            // }

        }, ms(bot.configs.timeout.duration))


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