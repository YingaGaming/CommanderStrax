/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";


module.exports = async (bot, message) => {

	if(message.partial)return

    //Do nothing if author is bot itself or channel is DM
    if (message.author == bot.user) return;
    if (message.author.bot) return;;
	if (message.channel.type == 'dm') return;
	
	/*if(message.content == ".dbinit"){
		bot.db.insertObject('Servers', {
			id: message.guild.id,
			name: message.guild.name,
			prefix: '.'
		})
		return message.reply('done')
	}*/

	if(message.channel.id == "554453061137989633"){
		if(!message.member.permissions.has("ADMINISTRATOR") && bot.tools.matchInvite(message.content)){
			message.delete()

            bot.tools.sendEmbed(bot, message.member.user, {
                description: 'Du darfst hier keine Invite Links senden'
            })

		}
	}

    if(!message.member.permissions.has("ADMINISTRATOR") && message.content.length > 10 && bot.tools.capsPercentage(message.content) >= 70){
        message.delete()

        bot.tools.sendEmbed(bot, message.member.user, {
            description: 'Bitte benutze weniger CAPS'
        })

    }


    bot.tools.sendRedirects(bot, message)


    bot.db.query('Servers', {
        id: message.guild.id
    }, res => {
        if (!res[0]) return

        let server = res[0]

        let prefix = server.prefix || bot.configs.general.prefix

        if(message.content == `<@${bot.user.id}>` || message.content == `<@!${bot.user.id}>`)return bot.tools.sendEmbed(bot, message.channel, {
            description: `Der aktuelle Prefix ist **${prefix}**`
        })

        //Do nothing if message doesn't start with prefix
        if (!message.content.startsWith(prefix)) return;


        //Get args and desired command
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const cmd = bot.commands.get(command);


        //Do nothing if command does not exist
        if (!cmd) return;


        //Run command
        cmd.run(bot, message, args, {
            server: server,
            prefix: prefix
        });


    })



};