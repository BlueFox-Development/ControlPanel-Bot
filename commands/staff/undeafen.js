

module.exports = {
    help: {
    
        name: "undeafen",
        description: "Undeafen a member in a voice channel",
        aliases: ["undeaf"],
        staff: true
       
    },

    run: async(client, message, args) => {
     if (!message.member.hasPermission("DEAFEN_MEMBERS")) return message.channel.send("**You Dont Have The Permissions To Ban Users! - [DEAFEN_MEMBERS]**");

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) ;

        if(!member) return message.channel.send("Unable to find the mentioned user in this guild.")

        let reason = args.slice(1).join(" ");
        if (!reason) reason = "No Reason Provided"


        try {
            member.voice.setDeaf(false, reason);
            message.channel.send("Success ✅ : Member Undeafened")
        } 
        
        catch (error) {
            console.log(error)
            message.channel.send("Oops! An unknow error occured. Please try again later.")
        }

    }
}