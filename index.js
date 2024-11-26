const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const Match = require('./models/Match');

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

let recipientId;

bot.on('message', async (msg) => {
    let telegram_id = msg.chat.id;
    let message = msg;

    if (msg.text && msg.text.startsWith('/')) {
        return;
    }

    console.log("User Telegram ID:", telegram_id);

    try {
        const activeMatch = await Match.findOne({
            $or: [{ user1: telegram_id }, { user2: telegram_id }],
            status: 'active'
        });

        console.log(activeMatch)

        if (!activeMatch) {
            console.log('No active match found for:', telegram_id);
            return bot.sendMessage(telegram_id, 'No active match found');
        }

        recipientId = parseInt(telegram_id) !== parseInt(activeMatch.user1) ? parseInt(activeMatch.user1) : parseInt(activeMatch.user2);
        console.log(typeof(recipientId))
        // recipientId = parseInt(recipientId);

        if (recipientId === telegram_id) {
            return bot.sendMessage(telegram_id, 'Error: Cannot forward messages to yourself');
        }

        console.log('Recipient ID:', recipientId);

        if (message.photo) {
            await bot.sendPhoto(recipientId, message.photo[0].file_id, { caption: message.caption || '' });
        } else if (message.sticker) {
            await bot.sendSticker(recipientId, message.sticker.file_id);
        } else if (message.document) {
            await bot.sendDocument(recipientId, message.document.file_id, { caption: message.caption || '' });
        } else if (message.video) {
            await bot.sendVideo(recipientId, message.video.file_id, { caption: message.caption || '' });
        } else if (message.audio) {
            await bot.sendAudio(recipientId, message.audio.file_id, { caption: message.caption || '' });
        } else if (message.voice) {
            await bot.sendVoice(recipientId, message.voice.file_id, { caption: message.caption || '' });
        } else if (message.animation) {
            await bot.sendAnimation(recipientId, message.animation.file_id, { caption: message.caption || '' });
        } else if (message.location) {
            await bot.sendLocation(recipientId, message.location.latitude, message.location.longitude);
        } else if (message.contact) {
            await bot.sendContact(recipientId, message.contact.phone_number, message.contact.first_name, { last_name: message.contact.last_name || '' });
        } else {
            await bot.sendMessage(recipientId, message.text);
        }
    } catch (error) {
        console.error('Error:', error);
        bot.sendMessage(telegram_id, 'An error occurred. Please try again.');
    }
});

// /next


// /stop


// /settings 

// /vip

// /pay

// 

// app listen 
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});