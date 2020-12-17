  const Discord = require('discord.js');
  const db = require('quick.db');
  module.exports = {
      help: {
    
        name: "warnlogs",
        description:"Warn a person",
        aliases: ['warns', 'warnings'],
        staff: true
    
    },
    run: async (client, message, args) => {
      if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`You cannot run this command`);

      let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
      if(!user) return message.channel.send(`You didn't specify a correct user.`);
      
      const warnno = await db.fetch(`warn_${message.guild.id}_${user.id}`);
      //let warnno = db.fetch(`warn_${message.guild.id}_${user.id}`, 1)
      
      let warns = await db.get(`warns_${message.guild.id}_${user.id}`)
      
      if(warns == null || warns == 0){
        let noembed = new Discord.MessageEmbed()
        .setTitle(`Warn Logs`)
        .setColor(`BLUE`)
        .setDescription(`This user hasn't been warned yet.`);
        return message.channel.send(noembed);
      }
      
      let warn = warns.join('\n');
      
      const warnembed = new Discord.MessageEmbed()
      .setColor(`ORANGE`)
      .setTitle(`Warn Logs`)
      .setDescription(`${user} has been warned **${warnno}** times\n\n ${warn}`)
      message.channel.send(warnembed);
    
    }
  }