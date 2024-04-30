const config = require("../config.json");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(config.GEMINI_API);

async function geminiAi(prompt) {;
try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
} catch (e) {
    console.log(e);
    return "Error while generating text";
}
} 

module.exports = geminiAi