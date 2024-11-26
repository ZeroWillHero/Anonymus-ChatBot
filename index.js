const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');

const createUser = require('./routes/user/controller/createUser');
const updateUser = require('./routes/user/controller/updateUser');


const matchUsers = require('./Chat/botFunctions').matchUsers;
const createMatch = require('./routes/match/controller/createMatch');
const deleteMatch = require('./routes/match/controller/deleteMatch');
const sendMessages = require('./Chat/botFunctions').sendMessages;
// const sendMessageToPartner = require('./Chat/botFunctions').sendMessageToPartner;

const bot = require('./Chat/chatBot');
const bot_url = process.env.BOT_URL;

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;
require('./database/databse');

// start/
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    await createUser(chatId);
    const matchedUsers = await matchUsers(chatId);
    if (matchedUsers) {
        await createMatch(matchedUsers.user1, matchedUsers.user2);
        // send to the chat id of partner 
        console.log(matchedUsers.user1.telegramId, matchedUsers.user2.telegramId);

        bot.sendMessage(matchedUsers.user1.telegramId, 'You have been matched! Say hi to your new partner.');
        bot.sendMessage(matchedUsers.user2.telegramId, 'You have been matched! Say hi to your new partner.');

    }

});

bot.on('message', async (msg) => {
    if (msg.text && msg.text.startsWith('/')) {
        return;
    } else {
        await sendMessages(msg.chat.id,msg);
    }
})

// app listen 
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});