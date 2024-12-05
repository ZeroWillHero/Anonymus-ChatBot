const User = require('../../../models/User');

const updateUser = async (telegramId, updates) => {
    try {
        const user = await User.findOneAndUpdate(
            { telegramId },
            { $set: updates },
            { new: true }
        );
    
        if (!user){
            console.log("User not found");
            return null;
        }
    
        console.log("User Updated Successfully", user);
        return user;
    }catch(error){
        console.log("error : " , error);
    }
 
}

module.exports = updateUser;