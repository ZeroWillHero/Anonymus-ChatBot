const User = require('./../../../models/User');
const generateUsername = require('./../../../middlewares/generateUsername');

const createUser = async (telegramId) => {
    try {
        const username = generateUsername(telegramId);

        const existUser = await User.findOne({ telegramId: telegramId });

        if (existUser) {
            return console.log("User Already Exist");
        }

        const user = new User({
            telegramId,
            username
        });

        await user.save();

        console.log("User Created Successfully", user);
    } catch (error) {
        console.error(error);
    }
};

module.exports = createUser;