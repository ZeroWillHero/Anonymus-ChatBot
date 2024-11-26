const User = require('./../models/User');
const Match = require('./../models/Match');
const bot = require('../Chat/chatBot');

let currentPartnerId;
let currentSenderId;
let recipientId = "";

const matchUsers = async (chat_id) => {
    let matchUserItems = {};
    // find user in the database 
    const user1 = await User.findOne({ telegramId: chat_id });
    let matchQuery = {
        telegramId: { $ne: chat_id }, isOnline: true
    };

    console.log(user1);

    if (user1.subscription.type === 'premium') {
        bot.sendMessage(chat_id,
            'Please select the gender you want to search for:', {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Male', callback_data: 'search_male' },
                        { text: 'Female', callback_data: 'search_female' }
                    ]
                ]
            }
        });

        bot.on('callback_query', async (callbackQuery) => {
            const action = callbackQuery.data;
            const msg = callbackQuery.message;
            const chatId = msg.chat.id;

            if (chatId === chat_id) {
                let gender;
                if (action === 'search_male') {
                    gender = 'male';
                } else if (action === 'search_female') {
                    gender = 'female';
                }

                matchQuery['preferences.gender'] = gender;

                // find a matching partner for the user
                const user2 = await User.findOne(matchQuery);

                if (!user2) {
                    bot.sendMessage(chatId, 'No partner found . please type /search to search a partner');
                } else {
                    bot.sendMessage(chat_id, `Partner found 😺

/next — find a new partner
/stop — stop this dialog

https://t.me/Anonymus_Messaging_bot`);
                    matchUserItems = {
                        user2,
                        user1,
                    }
                    return matchUserItems;

                }
            }

        });
    } else {
        // find a matching partner for the free user 
        const user2 = await User.findOne(matchQuery);

        if (!user2) {
            bot.sendMessage(chat_id, 'No partner found . please type /search to search a partner');

        } else {
            bot.sendMessage(chat_id, `Partner found 😺

/next — find a new partner
/stop — stop this dialog

https://t.me/Anonymus_Messaging_bot`);
            matchUserItems = {
                user2,
                user1,
            }
            return matchUserItems;

        }
    }

};

const sendMessages = async (telegram_id, message) => {
    console.log("user telegram id is : ", telegram_id);
    try {
        const activeMatch = await Match.findOne(
            {
                $or: [{ user1: telegram_id }, { user2: telegram_id }],
                status: 'active'
            },
            'user1 user2'
        );
        recipientId = telegram_id === activeMatch.user2 ? activeMatch.user1 : activeMatch.user2;
        console.log("recipient id is : ", recipientId);
        console.log("active Match : ", activeMatch)
        if (!activeMatch) {
            bot.sendMessage(telegram_id, 'No active match found');
        } else {
            // Determine the reciption ID 
            console.log(recipientId);

            if (recipientId !== telegram_id) {
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
            }
            // await bot.sendMessage(recipientId,message.text);

        }
        console.log(activeMatch);


    } catch (error) {
        console.log("error : ", error);
    }

}
module.exports = {
    sendMessages,
    matchUsers
};