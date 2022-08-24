/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";


module.exports.run = async(bot, message, args, data) => {
    try {

        bot.tools.sendEmbed(bot, message.channel, {
            fields: [{
                    name: data.server.prefix + 'ping',
                    value: 'Zeigt den Ping zu der Discord API an'
                },
                {
                    name: data.server.prefix + 'prefix <neuer prefix>',
                    value: 'Setzt einen neuen Prefix'
                },
                {
                    name: data.server.prefix + 'move [--force] <Kanal>',
                    value: 'Verschiebt alle Mitglieder vom aktuellen Sprachkanal in einen anderen'
                },
                {
                    name: data.server.prefix + 'timeout @User',
                    value: 'Sorgt dafür dass sich ein Mitglied beruhigt'
                },
                {
                    name: data.server.prefix + 'strike @User',
                    value: 'Gibt einem Mitglied einen Strike'
                },
                {
                    name: data.server.prefix + 'ban <ID> [Tage (0=inf)] [Grund]',
                    value: 'Bannt einen User per ID'
                },
                {
                    name: data.server.prefix + 'purge <Anzahl>',
                    value: 'Bereinigt Textkanäle'
                }
            ]
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