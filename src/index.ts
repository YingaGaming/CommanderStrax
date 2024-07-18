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

import 'module-alias/register'
import { Client, GatewayIntentBits } from 'discord.js'
import fs from 'fs/promises'

import dotenv from 'dotenv'
dotenv.config()

const client = new Client({
	intents: [
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences
	]
})

fs.readdir('./dist/events')
	.then(files => {
		files.forEach(async (file) => {
			let name = file.split('.')[0]
			let event = await import(`./events/${file}`)
			client.on(name, event.default.bind(null, client))
		})
	})

client.login(process.env['DISCORD_TOKEN'])
	.then(() => {
		console.log('Ready!')
	})
