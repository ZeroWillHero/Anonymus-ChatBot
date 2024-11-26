const Chatbot = require('node-telegram-bot-api');

const TOKEN = process.env.BOT_TOKEN;

const bot = new Chatbot(
    TOKEN,
    {
        polling: true
    }
);



module.exports = bot;

