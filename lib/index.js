const axios = require("axios");

const getJson = async (url, options = {}) => {
    try {
        const res = await axios({
            method: "GET",
            url,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
            },
            ...options,
        });
        return res.data;
    } catch (err) {
        throw err;
    }
};

async function verifyToken(token) {
    try {
        const json = await getJson(`https://api.telegram.org/bot${token}/getMe`);
        if (json && json.ok === true) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        throw err;
    }
}

module.exports = { verifyToken, getJson };
