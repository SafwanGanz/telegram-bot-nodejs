
const { MongoClient, ServerApiVersion } = require('mongodb');
const { MONGO_URL } = require('../config.json')

const uri = MONGO_URL;

const mdClient = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function main() {
    let flag1 = false, flag2 = false;
    try {
    await mdClient.connect();
    console.log('Connected successfully to Database');
    const db = mdClient.db('MyBotDataDB');
    const collection = await db.collections();
    collection.forEach(ele => {
        if (ele.namespace == "MyBotDataDB.users") {
            flag1 = true;
        }
        if (ele.namespace == "MyBotDataDB.group") {
            flag2 = true;
        }
    });
    if (flag1 == false) {
        await db.createCollection("users");
    }
    if (flag1 == false) {
        await db.createCollection("group");
    }
    return "done";
} catch (e) {
    console.log(e)
}
}

main();


module.exports = mdClient;