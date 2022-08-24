/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";

module.exports = async (bot, oldState, newState) => {

	let logChannel = bot.guild.channels.resolve(bot.configs.logs.voice)

	let member = newState.member

	if(newState.member.user.bot)return

	if(oldState.channel == newState.channel)return

	if(oldState.channel && oldState.channel.parentId == bot.configs.privatechannel.category && oldState.channel.id != bot.configs.privatechannel.lobby){

		if(oldState.channel.members.size < 1){
			oldState.channel.delete()
			bot.db.delete('PrivateChannels', {id: oldState.channel.id})
		}

	}

	if(newState.channel && newState.channel.id == bot.configs.privatechannel.lobby){

		let channel = await bot.guild.channels.create(member.user.tag, {
			type: 'GUILD_VOICE',
			parent: bot.configs.privatechannel.category,
			permissionOverwrites: [
				{
					id: member.user.id,
					allow: [
						'VIEW_CHANNEL',
						'CONNECT',
						'SPEAK'
					]
				},
				{
					id: bot.configs.roles.verified,
					allow: [
						'VIEW_CHANNEL',
						'CONNECT',
						'SPEAK'
					]
				}
			]
		})

		bot.db.insertObject('PrivateChannels', {
			id: channel.id,
			author: member.id,
			whitelist: false
		})

		member.voice.setChannel(channel)

		return
	}

	if(!oldState.channel && newState.channel){
		//Channel joined

		bot.tools.sendEmbed(bot, logChannel, {
			author: {
				name: newState.member.displayName,
				image: newState.member.user.avatarURL()
			},
			description: `${bot.configs.emoji.green_plus} **${newState.channel.name}**`,
			color: '#00ff00',
			timestamp: Date.now()
		})

	}else if(oldState.channel && !newState.channel){
		//Channel left

		bot.tools.sendEmbed(bot, logChannel, {
			author: {
				name: newState.member.displayName,
				image: newState.member.user.avatarURL()
			},
			description: `${bot.configs.emoji.red_minus} **${oldState.channel.name}**`,
			color: '#ff0000',
			timestamp: Date.now()
		})
	}else if(oldState.channel && newState.channel){
		//Channel switched

		bot.tools.sendEmbed(bot, logChannel, {
			author: {
				name: newState.member.displayName,
				image: newState.member.user.avatarURL()
			},
			description: `**${oldState.channel.name}** 🔄 **${newState.channel.name}**`,
			color: '#FFA500',
			timestamp: Date.now()
		})
	}
    
};