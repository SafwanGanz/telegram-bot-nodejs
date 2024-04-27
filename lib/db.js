const mdClient = require("./mongoDB");

mdClient.connect();

const member = mdClient.db("MyBotDataDB").collection("users");
const group = mdClient.db("MyBotDataDB").collection("group");
const setting = mdClient.db("MyBotDataDB").collection("settings");

const settings = async (_id) => {
    const res = await setting.findOne({ _id: _id });
    if (res == null) {
        await setting.insertOne({
            _id: _id,
            auto_dl: false,
            gpt: false,
            bc: false,
            welcome: false
        });
    } else {
        // already exists
    }
};

const createMembersData = async (id, name) => {
    const res = await member.findOne({ _id: id });
    if (res == null) {
        console.log("Creating Member Data : ", id);
        await member.insertOne({
            _id: id,
            username: name,
            isSudo: false,
            isBlock: false,
            gpt: false
        });
    } else {
        // user already exists
    }
};

const createGroupData = async (jid) => {
    const res = await group.findOne({ _id: jid });
    if (res == null) {
        // console.log("Creating Member Data : ", jid);
        await group.insertOne({
            _id: jid,
            antilink: false,
            welcome: false,
            local_only: false,
            messages: 0,
            level: 0,
            welcome_msg: "Hai @user Welcome to @subject \n\nPleas Dont Forgot Our Group description:\n@desc",
            mod: false
        });
    } else {
        // user already exists
    }
};

const getGroupData = async (jid) => {
    try {
        const res = await group.findOne({ _id: jid });
        return res;
    } catch (err) {
        console.log(err);
        return -1;
    }
};

const getMemberData = async (jid) => {
    try {
        const res = await member.findOne({ _id: jid });
        return res;
    } catch (err) {
        console.log(err);
        return -1;
    }
};

const memberCount = async () => {
    return new Promise((resolve, reject) => {
        member.countDocuments({}, (err, count) => {
            if (err) {
                reject(err);
            } else {
                resolve(count);
            }
        });
    });
};

module.exports = {
    createMembersData,
    getMemberData,
    member,
    group,
    createGroupData,
    getGroupData,
    memberCount,
    setting,
    settings
};
