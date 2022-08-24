/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */


const Discord = require('discord.js')
const fs = require('fs')
const https = require('https')
const ms = require('ms')
var randomEmoji = require('random-emoji');
const svg_to_png = require('convert-svg-to-png')
const request = require('request')
const getURLs = require('get-urls')
const util = require('util')
const promiseRequest = util.promisify(request)


module.exports.sendEmbed = async(bot, channel, data, cb) => {

    //Initialize new RichEmbed
    let embed = new Discord.MessageEmbed()

    //Set embed timestamp (default: current timestamp)
    if (data.timestamp) {
        embed.setTimestamp(data.timestamp)
    }

    //Set embed title
    if (data.title) {
        embed.setTitle(data.title.toString())
    }

    //Set embed description
    if (data.description) {
        embed.setDescription(data.description.toString())
    }

    //Set embed color (default: #9b59b6)
    if (data.color) {
        embed.setColor(data.color)
    } else {
        embed.setColor('#9b59b6')
    }

    //Set embed author (default: client user)
    if (data.author) {
        embed.setAuthor(data.author.name.toString(), data.author.image.toString())
    }

    //Set embed thumbnail
    if (data.thumbnail) {
        embed.setThumbnail(data.thumbnail.toString())
    }

    //Set embed image
    if (data.image) {
        embed.setImage(data.image.toString())
    }

    //Set embed footer (default: client username)
    if (data.footer) {
        embed.setFooter(data.footer.toString())
    }

    if (data.attachFiles) {
        embed.attachFiles(data.attachFiles)
    }

    //Add fields to embed
    if (data.fields) {
        for (let field of data.fields) {
            embed.addField(field.name.toString(), field.value.toString(), field.inline)
        }
    }

    //Set embed URL
    if (data.url) {
        embed.setURL(data.url.toString())
    }

    //Send embed into channel
    let msg
    if (data.content) {
        msg = await channel.send({ content: data.content, embeds: [embed] })
    } else if (data.reply) {
        msg = await channel.reply({ embeds: [embed] })
    } else {
        msg = await channel.send({ embeds: [embed] })
    }

    //If callback is provided, call it with message object
    if (cb) {
        await cb(msg)
    }

    //Return message object
    return msg
}

module.exports.generateEmbed = async(bot, data, cb) => {

    //Initialize new RichEmbed
    let embed = new Discord.RichEmbed()

    //Set embed timestamp (default: current timestamp)
    if (data.timestamp) {
        embed.setTimestamp(data.timestamp)
    } else {
        if (data.timestamp != false) {
            embed.setTimestamp()
        }
    }

    //Set embed title
    if (data.title) {
        embed.setTitle(data.title)
    }

    //Set embed description
    if (data.description) {
        embed.setDescription(data.description)
    }

    //Set embed color (default: #9b59b6)
    if (data.color) {
        embed.setColor(data.color)
    } else {
        embed.setColor('#9b59b6')
    }

    //Set embed author (default: client user)
    if (data.author) {
        embed.setAuthor(data.author.name, data.author.image)
    } else {
        embed.setAuthor(bot.user.username, bot.user.displayAvatarURL)
    }

    //Set embed thumbnail
    if (data.thumbnail) {
        embed.setThumbnail(data.thumbnail)
    }

    //Set embed image
    if (data.image) {
        embed.setImage(data.image)
    }

    //Set embed footer (default: client username)
    if (data.footer) {
        embed.setFooter(data.footer)
    } else {
        if (data.footer != false) {
            embed.setFooter(bot.user.username)
        }
    }

    //Add fields to embed
    if (data.fields) {
        for (let field of data.fields) {
            embed.addField(field.name, field.value, field.inline)
        }
    }

    //Set embed URL
    if (data.url) {
        embed.setURL(data.url)
    }

    //If callback is provided, call it with generated embed
    if (cb) {
        await cb(embed)
    }

    //Return the generated embed
    return embed
}

module.exports.dateToString = (date) => {

    //Define minutes
    let minutes

    //If minutes are less than 10, add a 0 in front
    if (date.getMinutes() < 10) {
        minutes = '0' + date.getMinutes().toString()
    } else {
        minutes = date.getMinutes()
    }

    //Return parsed String
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${minutes}`
}

module.exports.sendError = async(bot, message, error) => {

    console.error(error)

    return

    let logchannel = bot.channels.get('597681536690683904')

    bot.tools.sendEmbed(bot, logchannel, {
        title: "Error Log",
        description: `**Original Message**: ${message.content}\n\n**Error**: ${error}`,
        color: '#0000ff'
    }, async msg => {
        await fs.writeFileSync(`./ignorewatch/errorstack_${msg.id}.txt`, error.stack)

        logchannel.send('', {
            file: {
                name: 'errorstack.txt',
                attachment: `./ignorewatch/errorstack_${msg.id}.txt`
            }
        }).then(() => {
            fs.unlink(`./ignorewatch/errorstack_${msg.id}.txt`, err => {
                return
            })
        })
    })


}

module.exports.downloadFile = (url, dest, cb) => {
    const file = fs.createWriteStream(dest);

    const request = https.get(url, (response) => {
        // check if response is success
        if (response.statusCode !== 200) {
            return cb('Response status was ' + response.statusCode);
        }

        response.pipe(file);
    });

    // close() is async, call cb after close completes
    file.on('finish', () => file.close(cb));

    // check for request error too
    request.on('error', (err) => {
        fs.unlink(dest);
        return cb(err.message);
    });

    file.on('error', (err) => { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result) 
        return cb(err.message);
    });
}

module.exports.refreshTicketMessage = async(bot) => {
    let channel = await bot.guild.channels.resolve(bot.configs.tickets.channels.create)

    channel.messages.fetch()
        .then(messages => {
            messages = messages.filter(x => x.author.id === bot.user.id)

            channel.bulkDelete(messages, true)
                .then(async() => {
                    let createMessage = await bot.tools.sendEmbed(bot, channel, {
                        description: 'Reagiere um ein Ticket zu erstellen\n\nDu kannst nur ein offenes Ticket gleichzeitig haben'
                    })

                    bot.ticketCreateMessage = createMessage

                    await createMessage.react("🎟️")

                })


        })
}

module.exports.createTicket = async(bot, author) => {
    let openCategory = await bot.guild.channels.resolve(bot.configs.tickets.channels.open)

    bot.db.query('Tickets', {
        author: author.id,
        closed: false
    }, async r => {
        if (r[0]) return bot.tools.sendEmbed(bot, author, {
            title: 'Ich konnte dein Ticket nicht erstellen',
            description: "Du hast bereits ein offenes Ticket"
        })

        let name = `#${bot.tools.getRandomInt(100000, 999999)}`
        while (openCategory.children.find(x => x.name === name)) {
            name = `#${bot.tools.getRandomInt(100000, 999999)}`
        }

        let channel = await bot.guild.channels.create(name, {
            type: 'text',
            parent: openCategory,
            permissionOverwrites: [{
                    id: author.id,
                    allow: ['VIEW_CHANNEL', "SEND_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY", "USE_EXTERNAL_EMOJIS"],
                },
                {
                    id: bot.guild.id,
                    deny: ['VIEW_CHANNEL']
                }
            ]
        })

        let menuMessage = await bot.tools.sendEmbed(bot, channel, {
            content: `<@${author.id}>`,
            description: `Hier ist dein Ticket!\n\nBitte beschreibe kurz dein Anliegen\n\nUm das Ticket zu schließen, reagiere mit 🔒`
        })

        menuMessage.react("🔒")

        bot.db.insertObject('Tickets', {
            name: name,
            id: channel.id,
            author: author.id,
            menu: menuMessage.id,
            closed: false,
            created: Date.now(),
            members: []
        })

    })

}

module.exports.closeTicket = async(bot, ticket, channel, deleter) => {
    let closedCategory = await bot.guild.channels.resolve(bot.configs.tickets.channels.closed)

    channel.setParent(closedCategory)

    channel.permissionOverwrites.set([{
            id: ticket.author,
            deny: ['SEND_MESSAGES'],
            allow: ['VIEW_CHANNEL']
        },
        {
            id: bot.guild.id,
            deny: ['VIEW_CHANNEL']
        }
    ]);

    let confirmMessage = await bot.tools.sendEmbed(bot, channel, {
        description: `Das Ticket wurde von <@${deleter.id}> geschlossen\n\nUm es wieder zu öffnen, reagiere mit 🔓\n\nDas Ticket wird sich nach 24 Stunden selbst zerstören`
    })

    confirmMessage.react("🔓")

    bot.db.update('Tickets', {
        id: channel.id
    }, {
        closed: Date.now(),
        reopenMessage: confirmMessage.id
    })

}

module.exports.openTicket = async(bot, ticket, channel, opener) => {
    let openCategory = await bot.guild.channels.resolve(bot.configs.tickets.channels.open)

    channel.setParent(openCategory)

    channel.permissionOverwrites.set([{
            id: ticket.author,
            allow: ['SEND_MESSAGES'],
        },
        {
            id: bot.guild.id,
            deny: ['VIEW_CHANNEL']
        }
    ]);

    (await channel.messages.fetch(ticket.reopenMessage)).delete()

    bot.tools.sendEmbed(bot, channel, {
        description: `Das Ticket wurde von <@${opener.id}> geöffnet`
    })

    bot.db.update('Tickets', {
        id: channel.id
    }, {
        closed: false,
        reopenMessage: false
    })

}

module.exports.purgeTickets = async(bot) => {
    bot.db.query('Tickets', {}, async r => {
        if (!r) return;
        for (let ticket of r) {
            if (!ticket.closed) continue

            if (ticket.closed + ms('24h') > Date.now()) continue

            let channel = await bot.guild.channels.resolve(ticket.id)

            if (!channel) {
                bot.db.delete('Tickets', { id: ticket.id })
                continue
            }

            channel.delete()

            bot.db.delete('Tickets', { id: channel.id })

        }
    })
}

module.exports.getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.refreshCaptchaMessage = async(bot) => {
    let channel = await bot.guild.channels.resolve(bot.configs.captcha.channel)

    channel.messages.fetch()
        .then(messages => {
            messages = messages.filter(x => x.author.id === bot.user.id)

            channel.bulkDelete(messages, true)
                .then(async() => {
                    let createMessage = await bot.tools.sendEmbed(bot, channel, {
                        description: 'Um die Verifizierung zu starten, clicke auf ✅ unter dieser Nachricht. Du musst private Nachrichten erlauben.\n\nTo start verification, click on ✅ below. You have to allow DMs.'
                    })

                    bot.captchaMessage = createMessage

                    await createMessage.react("✅")

                })


        })
}

module.exports.emojiToUnicode = (emoji) => {
    var comp;
    if (emoji.length === 1) {
        comp = emoji.charCodeAt(0);
    }
    comp = (
        (emoji.charCodeAt(0) - 0xD800) * 0x400 +
        (emoji.charCodeAt(1) - 0xDC00) + 0x10000
    );
    if (comp < 0) {
        comp = emoji.charCodeAt(0);
    }
    return comp.toString("16");
};

module.exports.sendCaptcha = async(bot, user) => {

    let url = `https://strax.yinga.games/captcha?user=${user.id}`

    bot.tools.sendEmbed(bot, user, {
        description: `Klicke [hier](${url}) um dich zu verifizieren\n\nClick [here](${url}) to verify yourself`
    })

}

module.exports.updateStats = async(bot) => {

    // Member counter
    bot.guild.members.fetch({
        force: true
    }).then(members => {

        let filteredMembers = members.filter(x => !x.user.bot)

        let output = bot.configs.stats.members.template
            .split('%c%').join(filteredMembers.size.toString())

        let channel = bot.guild.channels.resolve(bot.configs.stats.members.channel)

        if (channel.name != output) {
            channel.setName(output, "Stat Update")
        }

    })


}

module.exports.capsPercentage = (input) => {

    let output = 0

    for (char of input) {
        if (char == char.toUpperCase() && isNaN(parseInt(char))) output += 1
    }

    return (output / input.length) * 100

}


module.exports.matchInvite = (input) => {
    return input.match(new RegExp("((?:(?:http|https)://)?(?:www.)?((?:disco|discord|discordapp).(?:com|gg|io|li|me|net|org)(?:/(?:invite))?/([a-z0-9-.]+)))", "i"))
}

module.exports.matchUrl = (input) => {
    return getURLs(input)
}

module.exports.getRedirect = async(input) => {

    for (let item of require('./configs/redirectcheck.json').whitelist) {
        if (
            input.toLowerCase().startsWith(item) ||
            input.toLowerCase().startsWith('http://' + item) ||
            input.toLowerCase().startsWith('https://' + item)
        ) {
            return
        }
    }

    let res = await promiseRequest({
        uri: input,
        method: 'GET',
        followRedirect: false
    })

    if (res.statusCode >= 300 && res.statusCode < 400) {

        let redirectHost = (new URL(res.headers.location)).hostname
        let inHost = (new URL(input)).hostname

        if (
            redirectHost == inHost ||
            redirectHost == 'www.' + inHost ||
            inHost == 'www.' + redirectHost
        ) return

        return res.headers.location
    }

}

module.exports.sendRedirects = async(bot, message) => {
    let urlList = bot.tools.matchUrl(message.content)
    let foundUrls = []
    for (let url of urlList) {
        let dest = await bot.tools.getRedirect(url)
        if (dest) foundUrls.push(dest)
    }

    let domainList = ""
    for (let url of foundUrls) {
        if (bot.tools.matchInvite(url) && message.channel.id == "554453061137989633" && !message.member.permissions.has("ADMINISTRATOR")) {
            message.delete()

            bot.tools.sendEmbed(bot, message.member.user, {
                description: 'Du darfst hier keine Invite Links senden'
            })
            return
        }

        domainList += `${(new URL(url)).hostname}\n`

    }

    if (domainList != "") {
        bot.tools.sendEmbed(bot, message, {
            title: 'Weiterleitungen:',
            description: domainList,
            reply: true
        })
    }
}