const { member, setting } = require('./db')
const config = require('../config')
const axios = require('axios')
async function getArgs(ctx) {
  try {
    var args = ctx.message.text;
    args = args.split(" ");
    args.shift();
    return args;
  } catch {
    return [];
  }
}

function getUser(ctx) {
  try {
    var user = ctx;
    var last_name = user["last_name"] || "";
    var full_name = user.first_name + " " + last_name;
    user["full_name"] = full_name.trim();
    return user;
  } catch (e) {
    throw e;
  }
}

async function getBot(ctx) {
  try {
    var bot = ctx.botInfo;
    var last_name = bot["last_name"] || "";
    var full_name = bot.first_name + " " + last_name;
    bot["full_name"] = full_name.trim();
    return bot;
  } catch {
    return {};
  }
}

async function getLink(file_id) {
  try {
    return (await bot.telegram.getFileLink(file_id)).href;
  } catch {
    throw "Error while get url";
  }
}


async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
async function isRegisteredGroup(id) {
  try {
    let res = await setting.findOne({ "_id": id });
    return res !== null;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function isRegisteredMember(id) {
  try {
    let res = await member.findOne({ "_id": id });
    return res !== null;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function getMemberData(id) {
  try {
    isOn = await isRegisteredMember(id)
    if (isOn == true) {
      let data = await member.findOne({ "_id": id })
      return data
    } else {
      data = 'No Data Found'
      return data
    }
  } catch (e) {
    console.log(e)
  }
}


async function getGroupData(id) {
  try {
    isOn = await isRegisteredGroup(id)
    if (isOn == true) {
      let data = await setting.findOne({ "_id": id })
      return data
    } else {
      data = 'No Data Found'
      return data
    }
  } catch (e) {
    console.log(e)
  }
}

async function fetch(url) {
  let res = await axios.get(url);
  return res.data;
}

async function getGroupType(id) {
  const isGroup = id.includes("group"); 
  return isGroup
}

async function getAdmin(ctx, chat_type, chat_id, from_id) {
  try {
    const isGroup = chat_type.includes("group"); 
    if (isGroup) {
  let admin_list = await ctx.getChatAdministrators(chat_id);
            let admins = admin_list.map(admin => admin.user.id);
            let isAdmin = admins.includes(from_id);
            return isAdmin
    } else {
      return false;
    }
  } catch(e) {
    console.log(e)
  }
}
module.exports = {
  getArgs,
  fetch,
  getUser,
  getBot,
  getLink,
  getGroupType,
  getAdmin,
  delay,
  isRegisteredGroup,
  isRegisteredMember,
  getMemberData,
  getGroupData
}
