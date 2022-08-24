/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";


module.exports = async(bot, reaction, user) => {

    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            return;
        }
    }

    if (user.partial) {
        try {
            await user.fetch();
        } catch (error) {
            return;
        }
    }

    if (user.id === bot.user.id) return

    let message = reaction.message

    // Open tickets
    if (message.id === bot.ticketCreateMessage.id) {
        reaction.users.remove(user)

        bot.tools.createTicket(bot, user)
    }

    // Close tickets
    if (message.channel.parentId == bot.configs.tickets.channels.open && reaction.emoji.name == "🔒") {
        bot.db.query('Tickets', { id: message.channel.id, closed: false }, r => {
            if (!r[0]) return
            if (message.id != r[0].menu) return
            reaction.users.remove(user)

            bot.tools.closeTicket(bot, r[0], message.channel, user)

        })
    }

    // Re-open tickets
    if (message.channel.parentId == bot.configs.tickets.channels.closed && reaction.emoji.name == "🔓") {
        bot.db.query('Tickets', { id: message.channel.id }, r => {
            if (!r[0]) return

            console.log(r[0].reopenMessage)

            if (message.id != r[0].reopenMessage) return

            reaction.users.remove(user)

            if (user.id == r[0].author) {
                bot.db.query('Tickets', { author: user.id, closed: false }, r2 => {
                    if (r2[0]) return bot.tools.sendEmbed(bot, user, {
                        title: 'Ich konnte das Ticket nicht öffnen',
                        description: 'Du hast bereits ein offenes Ticket'
                    })

                    bot.tools.openTicket(bot, r[0], message.channel, user)
                })
            } else {
                bot.tools.openTicket(bot, r[0], message.channel, user)
            }

        })
    }

    // Start verification
    if (bot.captchaMessage && message.id === bot.captchaMessage.id) {
        reaction.users.remove(user)

        bot.tools.sendCaptcha(bot, user)
    }

};