const request = require('request')
const express = require('express')

var app = express()

var jsonParser = express.json()

module.exports.start = async (bot) => {

    app.get('/captcha', (req, res, next) => {
        res.sendFile(__dirname + '/captcha.html')
    })

    app.get('/captcha/guildicon.png', (req, res, next) => {
        
        res.redirect(bot.guild.iconURL({
            format: 'png',
            size: 256
        }))

    })
    
    app.get('*', (req, res, next) => {
        res.redirect('https://xenorio.xyz')
    })

    app.post('/verify', jsonParser, (req, res, next) => {

        let code = req.body.code
        let user = req.body.user

        if(!code || !user)return res.send('Not Verified')

        request({
            uri: 'https://hcaptcha.com/siteverify',
            method: 'POST',
            form: {
                response: code,
                secret: bot.configs.secrets.hcaptcha
            }
        }, (err, response, body) => {

            let data = JSON.parse(body)

            if(!data.success)return res.send('Not Verified')

            let member = bot.guild.members.resolve(user)

            if(!member)return res.send('Not Verified')

            member.roles.add(bot.configs.roles.verified)

            res.send('Success')

        })

    })
    
    app.listen(2021)
}