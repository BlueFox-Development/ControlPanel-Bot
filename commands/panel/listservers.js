const request = require('request');
const Discord = require("discord.js");

exports.run = async (client, message, args, guildConf, userConf) => {

    let panel = guildConf.panel.url;
    let key = userConf.panel.apiKey;

    if (!panel) return client.sendErrorEmbed(message.channel, "No panel has been setup!");
    if (!key) return client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!account link API-KEY");

    request.get(`${panel}/api/client`, {
        auth: {
            'bearer': key
        }
    }, async function(err, response, body) {

        if (err) return client.sendErrorEmbed(message.channel, "Could not connect to panel");
        if (response.statusCode === 403) return client.sendErrorEmbed(message.channel, "Invalid api key!");

        body = JSON.parse(body).data;

        client.userDB.set(`${message.author.id}-${message.guild.id}`, body.map(b => b.attributes), "panel.servers");

        const embed = new Discord.MessageEmbed()
            .setTitle("Your Servers")
            .setColor(client.config.embed.color)
            .setFooter(client.config.embed.footer)

        for (let i = 0; i < body.length && i < 10; i++) {
            let server = body[i].attributes;
            embed.addField(
server.name,
`
Ram: ${server.limits.memory} MB
Disk: ${server.limits.disk} MB
CPU Cores: ${server.limits.cpu === 0 ? "∞" : `${server.limits.cpu}%`}
Databases: ${server.feature_limits.databases}
ID: ${server.identifier}`, true)
            }

        embed.setDescription(body.length === 0 ? "None" : "**To focus a server**:\nDo: \`cp!focus <serverID>\`")

        await message.channel.send(embed);

    });


}

module.exports.help = {
    name: "listservers",
    description: "Shows all of your servers",
    dm: true,
    aliases: ["ls"]
}
