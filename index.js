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
const updateMatch = require('./routes/match/controller/updateMatch');
const submitReview = require('./Chat/botFunctions').submitReview;
// const sendMessageToPartner = require('./Chat/botFunctions').sendMessageToPartner;

const bot = require('./Chat/chatBot');
const getMatch = require('./routes/match/controller/getMatch');
const bot_url = process.env.BOT_URL;

// import components 
const reportingComp = require('./components/reporting');


app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;
require('./database/databse');

// GLOBAL VARIABLES 
let is_searching = false;


// start/
bot.onText(/\/start/, async (msg) => {
    is_searching = true
    const chatId = msg.chat.id;
    await createUser(chatId);

    // update is_online true
    const user = await updateUser(chatId, { is_online: true });
    console.log(user);

    const matchedUsers = await matchUsers(msg.chat.id);
    if (matchedUsers) {

        await createMatch(matchedUsers.user1, matchedUsers.user2);
        // send to the chat id of partner 
        console.log(matchedUsers.user1.telegramId, matchedUsers.user2.telegramId);
        bot.sendMessage(matchedUsers.user1.telegramId, `Partner found 😺

            /next — find a new partner
            /stop — stop this dialog
            
            https://t.me/Anonymus_Messaging_bot`);

        bot.sendMessage(matchedUsers.user2.telegramId, `Partner found 😺

                /next — find a new partner
                /stop — stop this dialog
                
                https://t.me/Anonymus_Messaging_bot`);
    }
});

// search 
bot.onText(/\/search/, async (msg) => {
    const matchedUsers = await matchUsers(msg.chat.id);
    if (matchedUsers) {

        await createMatch(matchedUsers.user1, matchedUsers.user2);
        // send to the chat id of partner 
        console.log(matchedUsers.user1.telegramId, matchedUsers.user2.telegramId);

        // bot.sendMessage(matchedUsers.user1.telegramId, 'You have been matched! Say hi to your new partner.');
        // bot.sendMessage(matchedUsers.user2.telegramId, 'You have been matched! Say hi to your new partner.');
    }


});

// lookin for messages
bot.on('message', async (msg) => {
    let telegram_id = msg.chat.id;
    let message = msg;

    if (msg.text && msg.text.startsWith('/')) {
        return;
    }

    


    try {
        const activeMatch = await Match.findOne({
            $or: [{ user1: telegram_id }, { user2: telegram_id }],
            status: 'active'
        });

        console.log(activeMatch)

        if (!activeMatch) {
            console.log('No active match found for:', telegram_id);
            return bot.sendMessage(telegram_id, 'type /search to find a partner');
        }

        recipientId = parseInt(telegram_id) !== parseInt(activeMatch.user1) ? parseInt(activeMatch.user1) : parseInt(activeMatch.user2);
        // recipientId = parseInt(recipientId);

        if (recipientId === telegram_id) {
            return bot.sendMessage(telegram_id, 'Error: Cannot forward messages to yourself');
        }


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
bot.onText(/\/next/, async (msg) => {
    // store user info for reporting 
    try {
        const deletedMatch = await deleteMatch(String(msg.chat.id));
        // console.log("delete match object ", deletedMatch);
        if (deletedMatch) {
            reportingComp(recipientId, msg.chat.id);
            const recipientId = String(msg.chat.id) === deletedMatch.user1 ? deletedMatch.user2 : deletedMatch.user1;
            // update recipient as not in match and not online 
            const recipientUpdate = await updateUser(recipientId, { is_online: false, is_matched: false });
        } else {
            bot.sendMessage(msg.chat.id, 'No active match found please /start to match with a new partner');
        }
    } catch (error) {
        console.log(error);
    }


    // // search for active match 
    // const activeMatch = await Match.findOne({
    //     $or: [{ user1: msg.chat.id }, { user2: msg.chat.id }],

    // });

    // console.log(activeMatch);

    // // store the chat id for submit a review 
    // const recipientId = activeMatch.user1 == msg.chat.id ? activeMatch.user2 : activeMatch.user1;
    // // submit review 


    // if (activeMatch){
    //     const updatedMatch = await updateMatch(activeMatch._id);
    //     console.log(updatedMatch);
    // }

    bot.sendMessage(msg.chat.id, 'looking for partner');
    // start new chat session 
    const matchedUsers = await matchUsers(msg.chat.id);
    if (matchedUsers) {
        await createMatch(matchedUsers.user1, matchedUsers.user2);
        // send to the chat id of partner 
        // bot.sendMessage(matchedUsers.user1.telegramId, 'You have been matched! Say hi to your new partner.');
        // bot.sendMessage(matchedUsers.user2.telegramId, 'You have been matched! Say hi to your new partner.');
    }

});


// /stop
bot.onText(/\/stop/, async (msg) => {
    // search current match 
    try {
        const currentMatch = await Match.findOne({
            $or: [{ user1: msg.chat.id }, { user2: msg.chat.id }],
            status: 'active'
        });
        // set users are not in match 
        if (currentMatch.user1) {await updateUser(currentMatch.user1, { is_online: false })}
        if (currentMatch.user2) {await updateUser(currentMatch.user2, { is_online: false })}

        console.log("updated online status for both users");


        const recipient = currentMatch.user1 == msg.chat.id ? currentMatch.user2 : currentMatch.user1;
        bot.sendMessage(recipient, `Your partner has stopped the dialog 😞
Type /search to find a new partner

https://t.me/chatbot.`);

        bot.sendMessage(msg.chat.id, `_You stopped the dialog_ 🙄
_Type /search to find a new partner_

https://t.me/chatbot`)

    } catch (error) {
        console.log(error);
    }

    // delete the current match 
    const deletedMatch = await deleteMatch(String(msg.chat.id));
    // looking for if deleteMatch available 
    if (deletedMatch) {
        console.log('Match deleted successfully');
    } else {
        bot.sendMessage(msg.chat.id, `No active match found
             please /start to match with a new partner`);
    }
});

// /settings 

// /vip

// /pay

// get my id
bot.onText(/\/myid/, (msg) => {
    bot.sendMessage(msg.chat.id, `_Your ID:_ ${msg.chat.id}`, { parse_mode: 'Markdown' });
    
});

// app listen 
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});