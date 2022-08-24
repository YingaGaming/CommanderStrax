/* Copyright (C) 2019 | Xenorio - Management | All Rights Reserved
 * Unauthorized copying, distributing, and using of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Marcus Huber (Xenorio) <realxenorio@gmail.com>
 */

"use strict";

//Imports
const { Client, Intents } = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');


//Display ASCII art
console.log('\x1b[36m%s\x1b[0m', fs.readFileSync('./asciiart.txt', 'utf-8'))


//Load bot token
const token = fs.readFileSync('./bot.token', 'utf-8');

const allIntents = new Intents(32767);

//Initialize client
var bot = new Client({
    partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
    intents: allIntents
});


//Load tools module
bot.tools = require('./tools.js');


//Declare variables for loading files
bot.commands = new Enmap();
bot.webhook_commands = new Enmap();
bot.configs = {};
bot.handlers = {};
bot.listeners = {};


//Load commands
fs.readdir('./commands/', (error, files) => {

    console.log('> loading commands')

    if (error) throw error;

    files.forEach(file => {
        if (!file.endsWith('.js')) return;

        let command = require(`./commands/${file}`);
        let name = file.split('.')[0];

        bot.commands.set(name, command);
    })
})

//Load configs
fs.readdir('./configs/', (error, files) => {

    console.log('> loading configs')

    if (error) throw error;

    files.forEach(file => {
        let config = JSON.parse(fs.readFileSync(`./configs/${file}`, 'utf-8'));
        let name = file.split('.')[0];

        bot.configs[name] = config;
    });
});

//Load Events
fs.readdir('./events/', (error, files) => {

    console.log('> loading events')

    if (error) throw error;

    files.forEach(file => {
        let event = require(`./events/${file}`);
        let name = file.split('.')[0];

        bot.on(name, event.bind(null, bot));
    });
});


//Load MongoDB Handler
bot.db = require('./handlers/mongodb_handler.js')

//Load emoji blocklist
bot.blockedEmojis = require('./ignorewatch/blocked_emojis.json')


//Login to Discord
console.log('> logging in')
bot.login(token);