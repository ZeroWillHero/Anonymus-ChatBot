const User = require('./../models/User');

const isPremium = async (chat_id) => {

    try {
        // find the user from the model 
        const user = await User.findOne({ telegramId: chat_id });
        // check if it is premium user 
        if (user && user.subscription.type === 'premium') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }


}

// export function 
module.exports = isPremium;