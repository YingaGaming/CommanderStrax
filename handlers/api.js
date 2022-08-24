const express = require('express')
const fs = require('fs')

const PORT = 2003

var app = express()

app.use(express.json())

module.exports.start = async (bot) => {

    fs.readdir('./api/', async (error, files) => {

        console.log('> loading API')
    
        if (error) throw error;
    
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
    
            let command = require(`../api/${file}`);
            let name = file.split('.')[0];
    
            if(!command.info || !command.info.method)return console.log(`> API command "${name}" has no method`)

            if(command.info.method.toLowerCase() == 'get'){
                app.get(`/${name}`, (req, res, next) => {
                    command.run(bot, req, res)
                })
            }else if(command.info.method.toLowerCase() == 'post'){
                app.post(`/${name}`, (req, res, next) => {
                    command.run(bot, req, res)
                })
            }

        })

        app.listen(PORT, () => {
            console.log('> API listening')
        })

    })

}