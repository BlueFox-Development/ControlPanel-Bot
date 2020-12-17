const { MessageEmbed } = require('discord.js');

module.exports = {
    help: {
        name: "setnick",
        aliases: ["sn", 'nick'],
        staff: true
    },
    run: async (client, message, args) => {
        if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.channel.send("**You Dont Have Permissions To Change Nickname! - [MANAGE_NICKNAMES]**");
        if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) return message.channel.send("**I Dont Have Permissions To Change Nickname! - [MANAGE_NICKNAMES]**");
      
        if (!args[0]) return message.channel.send("**Please Enter A User!**")
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (!member) return message.channel.send("**Please Enter A Username!**");

        if (member.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send('**Cannot Set or Change Nickname Of This User!**')
        if (!args[1]) return message.channel.send("**Please Enter A Nickname**");

        let nick = args.slice(1).join(' ');

        try {
        member.setNickname(nick).catch(() => message.channel.send("Couldn't Change the nickname.").then((message) => message.delete({ timeout: 3000 })))
        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`**Changed Nickname of ${member.displayName} to ${nick}**`)
            message.channel.send(embed)
        } catch {
            return message.channel.send("**Missing Permissions - [MANAGE_NICKNAMES]")
        }
    }
}