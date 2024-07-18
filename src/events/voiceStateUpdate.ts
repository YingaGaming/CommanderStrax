// Copyright (C) 2024 Marcus Huber (xenorio) <dev@xenorio.xyz>
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { Client, ColorResolvable, TextChannel, VoiceState } from 'discord.js'
import { sendEmbed } from '@util/embeds'

export default async (client: Client, oldState: VoiceState, newState: VoiceState) => {

	if(!newState.member) return

	if(oldState.channelId != newState.channelId){

		let description = 'Error'
		let color: ColorResolvable

		if(!oldState.channel && newState.channel) {
			// Join
			description = `➡️ **${newState.channel.name}**`
			color = 'Green'
		} else if(oldState.channel && !newState.channel) {
			// Leave
			description = `⬅️ **${oldState.channel.name}**`
			color = 'Red'
		} else {
			// Switch
			description = `**${oldState.channel!.name}** ↔️ **${newState.channel!.name}**`
			color = 'Yellow'
		}

		sendEmbed(<TextChannel> client.channels.resolve('804630546172739584'), {
			description,
			color,
			timestamp: Date.now(),
			author: {
				name: newState.member.displayName,
				iconURL: newState.member.displayAvatarURL({
					extension: 'png'
				}) || undefined
			}
		})
	}
}