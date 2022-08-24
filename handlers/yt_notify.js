
const YouTubeNotifier = require('youtube-notification');

var notifier

module.exports.init = async (bot) => {

    let notifyChannel = bot.guild.channels.resolve(bot.configs.notifications.youtube.channel)

    notifier = new YouTubeNotifier({
        hubCallback: 'https://strax.xenorio.xyz/callbacks/youtube',
        port: 2020,
        //secret: 'Something',
        path: '/callbacks/youtube'
    });
    notifier.setup();

    notifier.on('notified', data => {

        bot.tools.sendEmbed(bot, notifyChannel, {
            title: data.video.title,
            author: {
                name: data.channel.name
            },
            description: data.video.link
        })

    });

    this.subscribe(bot.configs.notifications.youtube.subscriptions)

}

module.exports.subscribe = async (channel) => {
    console.log(`> Subscribing to YouTube Notifications from ${channel}`)
    notifier.subscribe(channel);
}