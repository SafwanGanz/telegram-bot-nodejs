const { Telegraf, Context } = require('telegraf')
const { message } = require('telegraf/filters')
const { useNewReplies } = require("telegraf/future")
const { verifyToken } = require('./lib/index')
const { getArgs, getUser, delay } = require('./lib/function')
const fs = require('fs')
let cp = require('child_process')
let { promisify } = require('util')
const { createMembersData, member, getMemberData, setting, settings } = require('./lib/db')
const config = require('./config.json')


if (config.BOT_TOKEN == "") {
    console.log("Pleas Add Your Bot token in config.json")
}
const isOwner = config.OWNER_ID
verifyToken(config.BOT_TOKEN).then((res) => {
    if (!res) {
        console.log("Invalid Bot Token");
        process.exit();
    } else {
        console.log("Connecting...");
        const bot = new Telegraf(config.BOT_TOKEN)
        console.log('connected')
        bot.use(useNewReplies());
        bot.telegram.setMyCommands([
            { command: "/start", description: "Start Command" },
            { command: "/help", description: "Commands List" }
        ]);
        bot.start(async (ctx) => {
            welcome_note = `Hai ${ctx.message.from.first_name}\n\n`
            try {
                let check_db = await member.findOne({ "_id": ctx.message.from.id })
                if (check_db == null) {
                    await createMembersData(ctx.message.from.id, ctx.message.from.first_name)
                } else {
                    // console.log('User Already exists')
                }
            } catch (e) {
                console.log(e)
            }
            welcome_note += `This is a list of available commands:\n\n/start - Start the bot\n/help - List of commands\n/ping - Check if the bot is online\n\nNote that this bot is still under devlopment and more features will be added soon.`
            buttons = [
                [{ text: 'Add to your group', url: "https://t.me/felixStudyBot?startgroup" }]
            ]
            ctx.reply(welcome_note, {
                reply_markup: {
                    inline_keyboard: buttons
                }
            })
        });
        bot.help((ctx) => {
            console.log(ctx.message.chat.id)
            const buttons = [
                [
                    { text: 'Settings ⚙️', callback_data: 'settings' },
                    { text: 'Sudo Lst 📋', callback_data: 'sudo' },
                    { text: 'Mode lst 🪛', callback_data: 'moderators' }
                ],
                [
                    { text: 'test', callback_data: 'hhh' }
                ]
            ];

            ctx.reply(`As the owner of the bot, you have access to sensitive settings and controls that govern the behavior and functionality of the bot. It's crucial to handle these settings with care to maintain the integrity and security of the bot's operations. `, {
                reply_markup: {
                    inline_keyboard: buttons
                }
            });
        });
        bot.on('callback_query', async (ctx) => {
            const data = ctx.update.callback_query.data;
            const msg_id = ctx.update.callback_query.message.message_id
            switch (data) {
                case 'ping':
                    ctx.reply('Pong 🥳!')
                    await delay(1000)
                    ctx.deleteMessage(msg_id)
                    break
                case 'settings':
                    const buttons = [
                        { text: 'Back', callback_data: 'back' },
                        { text: 'Next', callback_data: 'next ' }
                    ]
                    setting_note = `Settings are a crucial part of the bot's functionality and behavior. They govern how the bot interacts wuth users and the environment. it's the owner's responsibility to manage these settings with care to ensure the bot operates as intended.`
                    ctx.reply(setting_note, {
                        reply_markup: {
                            inline_keyboard: [buttons]
                        }
                    })
                    break
                case 'leave':
                    ctx.deleteMessage(ctx.update.callback_query.message.message_id)
                    break
                case 'autodl_true':
                    isTurnOn = await setting.findOne({ "_id": ctx.message.chat.id })
                    break
            }
        })
        bot.on("message", async (ctx) => {
            const body = ctx.message.text || ctx.message.caption || "";
            var comm = body.trim().split(" ").shift().toLowerCase();
            var cmd = false;
            if (config.PREFIX != "" && body.startsWith(config.PREFIX)) {
                cmd = true;
                comm = body.slice(1).trim().split(" ").shift().toLowerCase();
            }

            const command = comm;
            const args = await getArgs(ctx);
            const user = getUser(ctx.message.from);
            const isCmd = cmd;
            const isGroup = ctx.chat.type.includes("group");
            const groupName = isGroup ? ctx.chat.title : "";

            const isImage = ctx.message.hasOwnProperty("photo");
            const isVideo = ctx.message.hasOwnProperty("video");
            const isAudio = ctx.message.hasOwnProperty("audio");
            const isSticker = ctx.message.hasOwnProperty("sticker");
            const isContact = ctx.message.hasOwnProperty("contact");
            const isLocation = ctx.message.hasOwnProperty("location");
            const isDocument = ctx.message.hasOwnProperty("document");
            const isAnimation = ctx.message.hasOwnProperty("animation");
            const isMedia =
                isImage ||
                isVideo ||
                isAudio ||
                isSticker ||
                isContact ||
                isLocation ||
                isDocument ||
                isAnimation;

            const quotedMessage = ctx.message.reply_to_message || {};
            const isQuotedImage = quotedMessage.hasOwnProperty("photo");
            const isQuotedVideo = quotedMessage.hasOwnProperty("video");
            const isQuotedAudio = quotedMessage.hasOwnProperty("audio");
            const isQuotedSticker = quotedMessage.hasOwnProperty("sticker");
            const isQuotedContact = quotedMessage.hasOwnProperty("contact");
            const isQuotedLocation = quotedMessage.hasOwnProperty("location");
            const isQuotedDocument = quotedMessage.hasOwnProperty("document");
            const isQuotedAnimation = quotedMessage.hasOwnProperty("animation");
            const isQuoted = ctx.message.hasOwnProperty("reply_to_message");

            var typeMessage = body.substr(0, 50).replace(/\n/g, "");
            if (isImage) typeMessage = "Image";
            else if (isVideo) typeMessage = "Video";
            else if (isAudio) typeMessage = "Audio";
            else if (isSticker) typeMessage = "Sticker";
            else if (isContact) typeMessage = "Contact";
            else if (isLocation) typeMessage = "Location";
            else if (isDocument) typeMessage = "Document";
            else if (isAnimation) typeMessage = "Animation";

            switch (command) {
                case "ping":
                    ctx.reply("pong");
                    break;
                case "setsudo":
                    if (isOwner == ctx.message.chat.id) {
                        if (args) {
                            try {
                                db = await member.findOne({ "_id": args[0] });
                                if (db == null) {
                                    ctx.reply('You are not a member of this bot\n\nPlease use /start to start the bot');
                                } else {
                                    if (db.isSudo == true) {
                                        ctx.reply('You are sudo user');
                                    } else {
                                        db_update = await member.updateOne({ "_id": args[0] }, { $set: { isSudo: true } });
                                        note = `Hei ${ctx.message.from.first_name} Successfully added new sudo user`;
                                        ctx.reply(note);
                                    }
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        } else {
                            ctx.reply('Please provide user id');
                        }
                    } else {
                        ctx.reply('Only owner can use this');
                    }
                    break;
                case 'chatid':
                    ctx.reply('chat id: ' + ctx.message.from.id);
                    break;
                case 'botid':
                    ctx.reply('bot id: ' + ctx.botInfo.id);
                    break;
                case 'groupid':
                    ctx.reply('group id: ' + ctx.chat.id);
                    break;
                case 'movie':
                    if (args.length == 0) {
                        ctx.reply('please provide movie name');
                    } else {
                        movie_name = args[0];
                        ctx.reply(`searching for ${movie_name}...`);
                    }
                    break;
                case 'listuser':
                    try {
                        const users = await new Promise((resolve, reject) => {
                            member.find({}).toArray((err, users) => {
                                if (err) {
                                    console.error('Error occurred while fetching users', err);
                                    reject(err);
                                } else {
                                    resolve(users);
                                }
                            });
                        });

                        const userNames = users.map(user => {
                            user.username
                            user.id
                        }).join('\n');
                        console.log(userNames);
                    } catch (e) {
                        console.error('Error occurred', e);
                        ctx.reply('An error occurred while processing your request');
                    }
                    break;
                case 'bc':
                case 'broadcast':
                    try {
                        let data = await member.find({}).toArray()
                        arr = []
                        let res = data.forEach(res => {
                            arr.push(res._id)
                        })
                        ctx.sendMessage('Broadcast testing', arr)
                    } catch (e) {
                        console.log(e)
                    }
                    break
                case 'quote':
                    if (isQuoted && isGroup) {
                        quote = ctx.message.reply_to_message;
                        await ctx.reply(JSON.stringify(quote, null, 2));
                    } else {
                        ctx.reply('Please reply to a message ');
                    }
                    break;
                case 'speed':
                    if (isOwner == ctx.message.chat.id) {
                        let exec = promisify(cp.exec).bind(cp);
                        ctx.reply(`Running speed-test...`);
                        let o;
                        try {
                            o = await exec('python speed.py');
                        } catch (e) {
                            o = e;
                        } finally {
                            let { stdout, stderr } = o;
                            if (stdout.trim()) {
                                let result = stdout;
                                ctx.reply(result);
                            }
                            if (stderr.trim()) ctx.reply(stderr);
                        }
                    } else {
                        ctx.reply('Only owner can use this command');
                    }
                    break;
                case 'autodl':
                case 'dl':
                    button = [
                        { text: 'Enable', callback_data: '/autodl_true' },
                        { text: 'Disable', callback_data: '/autodl_false' },
                        [{ text: 'Leave', callback_data: 'leave' }]
                    ],
                        ctx.reply('For enable auto downloader click enable or if u want disable click disable', {
                            reply_markup: {
                                inline_keyboard: [button]
                            }
                        })
                    break
                default:
                    if (body == 'hello') {
                        ctx.reply('hello')
                    }
                    break

            }
        })
        bot.launch()
    }
})
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
