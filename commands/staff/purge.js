

module.exports = {
    help: {
        name: "purge",
        aliases: [],
        staff: true
    },
    run: async (client, message, args) => {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You Don't Have Sufficient Permissions!- [MANAGE_MESSAGES]")
        if (isNaN(args[0]))
            return message.channel.send('**Please Supply A Valid Amount To Delete Messages! Max Messages that can be purged=> 100**');

        if (args[0] > 100)
            return message.channel.send("**Please Supply A Number Less Than 100!**");

        if (args[0] < 1)
            return message.channel.send("**Please Supply A Number More Than 1!**");

        
            
        try{
            await message.channel.bulkDelete(args[0]).then(messages => {
                message.channel.send(`**Succesfully deleted \`${messages.size}/${args[0]}\` messages**`).then(msg => msg.delete({ timeout: 5000 }));
            }).catch(() => null)


        } catch(e) { console.log(e) }

    }
}