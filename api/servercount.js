module.exports.run = async (bot, req, res) => {
    res.send(JSON.stringify({
        amount: bot.guilds.size
    }))
}

module.exports.info = {
    method: 'GET'
}