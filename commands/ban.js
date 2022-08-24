/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";

module.exports.run = async(bot, message, args, data) => {
    try {

        if (!message.member.permissions.has('BAN_MEMBERS')) return bot.tools.sendEmbed(bot, message.channel, {
            title: 'Dir fehlt die "Ban Members" Berechtigung',
            color: '#ff0000'
        })

        if (!args[0]) return bot.tools.sendEmbed(bot, message.channel, {
            title: data.prefix + 'ban <ID> [Tage (0=inf)] [Grund]',
            color: '#ff0000'
        })

        let user = args[0]
        args.shift()

        let reason
        let duration

        try {
            duration = parseInt(args[0])
            args.shift()
            reason += args.join(' ')
        } catch (error) {
            reason = args.join(' ')
        }

        if (duration == 0) duration = null

        message.guild.bans.create(user, {
            reason: reason,
            days: duration
        })

        bot.tools.sendEmbed(bot, message.channel, {
            description: `<@${user}> wurde gebannt.`
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