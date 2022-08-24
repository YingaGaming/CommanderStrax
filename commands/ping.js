/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";


module.exports.run = async (bot, message, args, data) => {
    try {

        let ping = Math.round(bot.ws.ping)

        let emoji

        if (ping < 250) {
            emoji = '<:green_circle:597643949204701194>'
        } else if (ping < 500) {
            emoji = '<:yellow_circle:597643948969820163>'
        } else {
            emoji = ':red_circle:'
        }

        bot.tools.sendEmbed(bot, message.channel, {
            description: `${ping}ms ${emoji}`
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