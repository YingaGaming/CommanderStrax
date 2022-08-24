/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";

const request = require('request')
const fs = require('fs');

module.exports.run = async(bot, message, args, data) => {
    try {

        let requestAPI = async(path, paras, cb) => {
            request({
                method: 'GET',
                uri: `https://api.hypixel.net/skyblock${path}?key=${bot.configs.secrets.hypixel_api}&${paras}`,
                headers: {
                    "User-Agent": "Commander Strax"
                }
            }, async(err, res, body) => {

                if (err) {
                    message.channel.send('> API Error')
                    console.error(err)
                    return
                }

                if (typeof body != "object") {
                    try {
                        body = JSON.parse(body)
                    } catch (error) {
                        message.channel.send('> Parsing Error')
                        console.error(error)
                        console.error(body)
                        return
                    }
                }

                cb(body)

            })
        }

        if (!message.member.permissions.has("ADMINISTRATOR")) return bot.tools.sendEmbed(bot, message.channel, {
            description: 'Hier wird noch gewerkelt',
            color: '#ff0000'
        })

        let playername = args[0]

        request.get(`https://api.mojang.com/users/profiles/minecraft/${playername}`, (err, res, playerdata) => {
            if (err) {
                message.channel.send('> Mojang API Error')
                console.error(err)
                return
            }

            if (typeof playerdata != "object") {
                try {
                    playerdata = JSON.parse(playerdata)
                } catch (error) {
                    message.channel.send('> Parsing Error')
                    console.error(error)
                    console.error(playerdata)
                    return
                }
            }

            let playerUUID = playerdata.id

            if (!playerUUID) return bot.tools.sendEmbed(bot, message.channel, {
                description: `Ich konnte **${playername}** nicht finden`,
                color: '#ff0000'
            })

            requestAPI(`/profiles`, `uuid=${playerUUID}`, async(data) => {

                let profiles = data.profiles

                profiles.sort((a, b) => {
                    return b.members[playerUUID].last_save - a.members[playerUUID].last_save
                })

                let profile = profiles[0].members[playerUUID]

                return console.log(profiles)

                request({
                    method: 'POST',
                    uri: 'https://nariah-dev.com/api/networth/categories',
                    json: profile
                })


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