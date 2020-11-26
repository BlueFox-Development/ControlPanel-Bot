const Discord = require('discord.js');
const request = require('request');
const moment = require('moment');

exports.run = async (client, message, args, guildConf, userConf) => {

    let panel = guildConf.panel.url;
    let key = guildConf.panel.apiKey;

    if (!panel) return client.sendErrorEmbed(message.channel, "No panel has been setup!");
    if (!key) return client.sendErrorEmbed(message.channel, "You havent set your api key!\nDo: cp!account link API-KEY");

    let option = args[0];

    switch (option) {
        case "signup": {
            if (Object.keys(userConf.panel.data).length != 0) return client.sendErrorEmbed(message.channel, "You already have an account");

            const filter = m => m.author.id === message.author.id;

            let username;
            let email;

            await client.sendEmbed(message.channel, "Check your dms");

            let msg;

            try {
                msg = await client.sendEmbed(message.author, "Account Creation", "Please respond to the questions below in order to create an account.")
            } catch(e) {
                return client.sendErrorEmbed(message.channel, "Please turn your dms on and try again.")
            }

            // Ask for panel username
            client.sendEmbed(message.author, "1. Username", "What would you like your username to be?");
            msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    let msg = collected.first();
                    let content = msg.content;
                    if (content.length > 520) return client.sendErrorEmbed(message.author, "Username is over 20 characters");
                    username = content;

                    // Ask for panel email
                    client.sendEmbed(message.author, "2. Email", "What would you like your email to be?");
                    msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                        .then(collected => {
                            let msg = collected.first();
                            let content = msg.content;
                            email = content;

                            let EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            if (!EMAIL_REGEX.test(email)) return client.sendErrorEmbed(message.author, "Please provide a valid email. Please start over.")

                            let password = client.generatePassword(10);
                            const data = {
                                username: username,
                                email: email,
                                first_name: username,
                                last_name: username,
                                password: password,
                                root_admin: false,
                                language: "en"
                            }

                            request.post(`${panel}/api/application/users`, {
                                auth: {
                                    bearer: key
                                },
                                json: data
                            }, async function(err, response, body) {

                                let errors = response.body.errors;
                                if (errors && errors.length > 0) return client.sendErrorEmbed(message.author, errors[0].detail);

                                if (err) return client.sendErrorEmbed(message.author, "An error has occured");
                                if (response.statusCode === 403) return client.sendErrorEmbed(message.author, "Invalid api key!");

                                client.userDB.set(`${message.author.id}-${message.guild.id}`, response.body.attributes, "panel.data");

                                await client.sendEmbed(message.author, `Account Details`, `**Username**: ${username}\n**Email**: ${email}\n**Password**: ${password}`);

                            });

                        })
                        .catch((e) => console.log(e));

                })
                .catch((e) => console.log(e));

            return;

        }
        case "link": {

            let userKey = args[1];
            if (!userKey) return client.sendErrorEmbed(message.channel, "You must provide your api key from the panel");

            message.delete();

            request.get(`${panel}/api/client`, {
                auth: {
                    bearer: userKey
                }
            }, async function(err, response, body) {

                if (err) return client.sendErrorEmbed(message.channel, "An error has occured!");
                if (response.statusCode === 403) return client.sendErrorEmbed(message.channel, "Invalid api key!");

                client.userDB.set(`${message.author.id}-${message.guild.id}`, userKey, "panel.apiKey");
                return client.sendEmbed(message.channel, "Your account has been linked!");

            });

            return;
        }
        case "unlink": {

            if (Object.keys(userConf.panel.data).length === 0) return client.sendErrorEmbed(message.channel, `You must signup\n${guildConf.prefix}account signup`);

            client.userDB.set(`${message.author.id}-${message.guild.id}`, {
                focused: null,
                apiKey: null,
                data: {},
                servers: []
            }, "panel");
            return client.sendEmbed(message.channel, "Your account has been unlinked!");

        }
        case "info": {

            if (Object.keys(userConf.panel.data).length === 0) return client.sendErrorEmbed(message.channel, `You must signup\n${guildConf.prefix}account signup`);

            let user = userConf.panel.data;
            return client.sendEmbed(message.channel, "Panel User", `
**First Name**: ${user.first_name}
**Language**: ${user.language}
**Admin**: ${user.root_admin ? "✅" : "❌"}

**ID**: ${user.id}
**ExternalID**: ${user.external_id ? user.external_id : "❌"}
**2FA**: ${user["2fa"] ? "✅" : "❌"}

**Created**: ${moment(new Date()).diff(user.created_at, 'days') + ' days ago'}
**Last Updated**: ${moment(new Date()).diff(user.updated_at, 'days') + ' days ago'}

`)
        }
        case "reset": {

            if (Object.keys(userConf.panel.data).length === 0) return client.sendErrorEmbed(message.channel, `You must signup\n${guildConf.prefix}account signup`);

            let password = client.generatePassword(10);
            let user = userConf.panel.data;

            let data = {
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                password: password
            }

            request.patch(`${panel}/api/application/users/${user.id}`, {
                auth: {
                    bearer: key
                },
                json: data
            }, async function(err, response, body) {

                let errors = response.body.errors;
                console.log(errors);
                if (errors && errors.length > 0) return client.sendErrorEmbed(message.channel, errors[0].detail);

                if (err) return client.sendErrorEmbed(message.channel, "An error has occured");
                if (response.statusCode === 403) return client.sendErrorEmbed(message.channel, "Invalid api key!");

                client.userDB.set(`${message.author.id}-${message.guild.id}`, response.body.attributes, "panel.data");

                await client.sendEmbed(message.channel, `Your password has been reset!`, "Check your dms");
                await client.sendEmbed(message.author, `Account New Password`, password);

            });

            return;
        }
    }

    return client.sendEmbed(message.channel, "Invalid argument", "\`\`\`signup, link, unlink, info, reset\`\`\`")

}

module.exports.help = {
    name: "account",
    description: "Manage your account on the panel",
    dm: false,
    aliases: ["acc"]
}
