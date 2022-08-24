/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";


module.exports.run = async(bot, message, args, data) => {
    try {

        if (!message.member.permissions.has('MOVE_MEMBERS')) return bot.tools.sendEmbed(bot, message.channel, {
            title: 'Dir fehlt die "Move Members" Berechtigung',
            color: '#ff0000'
        })

        if (!message.member.voice.channel) return bot.tools.sendEmbed(bot, message.channel, {
            title: 'Du bist in keinem Sprachkanal',
            color: '#ff0000'
        })

        if (!args[0]) return bot.tools.sendEmbed(bot, message.channel, {
            title: 'Falsche Benutzung',
            description: `${data.prefix}move <Kanal Name>`,
            color: '#ff0000'
        })

        // console.log(message.guild.channels)
        // return

        // let channels = await message.guild.channels.fetch({
        //     force: true
        // })

        let search = args.join(' ').split('--force')[0]

        let channels = await message.guild.channels.fetch()
        let channel = channels.find(x => {
            if (x.name.toLowerCase().includes(search.toLowerCase()) && x.type == 'GUILD_VOICE') {
                return true
            } else {
                return false
            }
        })

        if (!channel) return bot.tools.sendEmbed(bot, message.channel, {
            title: `Ich konnte keinen Sprachkanal mit dem Namen **${args.join(' ')}** finden`,
            color: '#ff0000'
        })

        if (!channel.permissionsFor(message.member).has('CONNECT')) return bot.tools.sendEmbed(bot, message.channel, {
            title: 'Du darfst dich nicht mit diesem Kanal verbinden',
            color: '#ff0000'
        })

        message.member.voice.channel.members.forEach(member => {
            if (args[0] != '--force' && !channel.permissionsFor(member).has('CONNECT')) return
            member.voice.setChannel(channel, 'Move Command').catch(err => { return })
        })

        bot.tools.sendEmbed(bot, message.channel, {
            title: 'Der Kanal wurde gemoved',
            color: '#00ff00'
        })



    } catch (error) {
        bot.tools.sendEmbed(bot, message.channel, {
            title: 'Fehler',
            description: 'Ups! Da ist wohl ein Fehler aufgetreten',
            color: '#ff0000'
        })

        console.error('> error: ' + error)
    }
}

module.exports.info = {
    alias: []
}