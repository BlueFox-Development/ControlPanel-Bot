const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    help: {
        name:"warn",
        description:"Warn a person",
        aliases: [],
        staff: true
    },
 
 run: async(client, message, args) => {
    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`You cannot run this command`);
    
    let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if(!user) return message.channel.send(`You didn't specify a correct user.`);
    
    let reason = args.slice(1).join(" ");
    if(!reason) return message.channel.send(`No Reason Provided`);
    
    let d = new Date(); 
    let date = d.toUTCString();
    
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                                               }
        return result;
    }
    
    let warnid = makeid(10)
    let warnids = db.get(`warnid_${message.guild.id}`)
    
    for(var n in warnids){
        if(warnids[n] == warnid) warnid = makeid(10)
                         };

    db.push(`warnid_${message.guild.id}`, warnid)
    
    const warns = await db.fetch(`warn_${message.guild.id}_${user.id}`) || 1;
    db.add(`warn_${message.guild.id}_${user.id}`, 1)
    db.push(`warns_${message.guild.id}_${user.id}`, `**${warnid}** - ${reason} - ${message.author} - ${date}`)

    const warnembed2 = new Discord.MessageEmbed()
    .setColor(`RED`)
    .setTitle(`You were Warned!`)
    .setDescription(`${reason} \n\n by ${message.author.tag}`)
    .setFooter(`Warned at ${date}`);

    try{ user.user.send(warnembed2) }

catch(e) { message.channel.send(' Cannot DM that user! Sending warn report here!').then(m => m.delete({ timeout: 4000 })); return message.channel.send(warnembed2) }


  }
}