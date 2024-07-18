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

import { APIEmbed, ColorResolvable, Colors, EmbedAuthorOptions, EmbedBuilder, TextChannel } from "discord.js"

interface EmbedData {
	title?: string;
	description: string;
	color?: `#${string}` | ColorResolvable;
	content?: string;
	author?: EmbedAuthorOptions,
	timestamp?: Date | number
}

export const sendEmbed = (channel: TextChannel, data: EmbedData) => {
	const embed = buildEmbed(data)
	channel.send({
		content: data.content,
		embeds: [embed]
	})
}

export const buildEmbed = (data: EmbedData): APIEmbed => {
	const builder = new EmbedBuilder()

	builder.setTitle(data.title || null)
	builder.setDescription(data.description)
	builder.setColor(data.color || Colors.DarkPurple)
	builder.setAuthor(data.author || null)
	builder.setTimestamp(data.timestamp)

	return builder.toJSON()
}