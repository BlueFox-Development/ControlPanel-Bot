const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    help: {
    
        name:"delwarn",
        description:"Deltes a warn for a person",
        aliases: [],
        staff: true
    },
  
  run: async (client, message, args) => {

    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`You cannot run this command`);
    
    let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if(!user) return message.channel.send(`You didn't specify a correct user.`);
    
    if(!args[1]) return message.channel.send(`You need to specify a warn id.`);
    
    const warns = db.get(`warns_${message.guild.id}_${user.id}`)
    
    const filtered = warns.filter(e => !e.includes(args[1]));
    
    db.subtract(`warn_${message.guild.id}_${user.id}`, 1)
    db.set(`warns_${message.guild.id}_${user.id}`, filtered);
    
    const warnembed = new Discord.MessageEmbed()
    .setColor(`ORANGE`)
    .setDescription(`Removed warning from ${user}`)
    message.channel.send(warnembed);
  }
}