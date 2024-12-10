const User = require('./../models/User');
const Match = require('./../models/Match');
const bot = require('../Chat/chatBot');

const updateUser = require('./../routes/user/controller/updateUser');


const matchUsers = async (chat_id) => {
    let matchUserItems = {};
    // find user in the database 
    const user1 = await User.findOne({ telegramId: chat_id });
    let matchQuery = {
        telegramId: { $ne: chat_id }, is_matched: false, is_online: true
    };

    console.log(user1);

    if (user1.subscription.type === 'premium' && user1.subscription.type !== null) {
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

                // find a matching partner for the user, sorted by updateAt
                const user2 = await User.findOne(matchQuery).sort({ updatedAt: 1 });

                if (!user2) {
                    bot.sendMessage(chatId, 'No partner found . please type /search to search a partner');
                } else {
                    console.log("partner found");
                    matchUserItems = {
                        user2,
                        user1,
                    }

                    // update user accounts as matched
                    const user1Update = await updateUser({ is_matched: true });
                    const user2Update = await updateUser({ is_matched: true });

                    // console.log updated user versions 
                    console.log(user1Update);
                    console.log(user2Update);
                    return matchUserItems;

                }
            }

        });
    } else {
        // find a matching partner for the free user, sorted by updateAt
        const user2 = await User.findOne(matchQuery).sort({ updatedAt: 1 });

        if (!user2) {
            bot.sendMessage(chat_id, 'No partner found . please type /search to search a partner');

        } else {
            console.log('partner found');
            matchUserItems = {
                user2,
                user1,
            }

            // update user accounts as matched
            const user1Update = await updateUser({ is_matched: true });
            const user2Update = await updateUser({ is_matched: true });

            // console.log updated user versions 
            console.log(user1Update);
            console.log(user2Update);


            return matchUserItems;

        }
    }

};



module.exports = {
    matchUsers
};