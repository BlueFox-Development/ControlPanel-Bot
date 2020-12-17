module.exports = {
    help: {
          name: "slowmode",
          description: "Set the slowmode for the channel!",
          aliases: ['sm'],
          staff: true
    },
  run: async (client, message, args) => {
  
    if (!message.member.hasPermission("MANAGE_MESSAGES") && !ownerID.includes(message.author.id)) return message.channel.send("You Don't Have Sufficient Permissions!- [MANAGE_MESSAGES]")

    if (!args[0])
      return message.channel.send(
        `You did not specify the time in seconds you wish to set this channel's slow mode to!`
      );
      
    if (isNaN(args[0])) return message.channel.send(`That is not a number!`);
    
    message.channel.setRateLimitPerUser(args[0]);
    message.channel.send(
      `Done | Slowmode set to: \`${args[0]}\``
    );
  },
};