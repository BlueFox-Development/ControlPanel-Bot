

module.exports = {
    help: {
    
        name: "vcmove",
        description: "moves a member in from one voice channel to another",
        usage: "vcmove <user> <channel>",
        staff: true
       
    },

    run: async(client, message, args) => {
         if (!message.member.hasPermission("MOVE_MEMBERS") && !ownerID .includes(message.author.id)) return message.channel.send("**You Dont Have The Permissions To Ban Users! - [MOVE_MEMBERS]**");
        
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!member) return message.channel.send("Unable to find the mentioned user in this guild.")

        let channel = message.mentions.channels.first() || client.guilds.cache.get(message.guild.id).channels.cache.get(args[1]);
        if (!channel.type === "voice") return message.channel.send("Unable to locate the voice channel. Make sure to mention a voice channel not a text channel!") 

        try {
            member.voice.setChannel(channel);
            message.channel.send("Success ✅ : Member Moved!").then(message => message.delete({ timeout: 3000 }))
        } 
        
        catch(error) {
            console.log(error);
            message.channel.send("Oops! An unknown error occured. Please try again later.")
        }

    }
}