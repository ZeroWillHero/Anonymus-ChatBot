const User = require('./../../../models/User');
const Match = require('./../../../models/Match');

const createMatch = async (user1, user2) => {
    try {
        // Check if either user is already in an active match
        const existingMatch = await Match.findOne({
            isActive: true,
            $or: [
                { user1: user1.telegramId },
                { user2: user1.telegramId },
                { user1: user2.telegramId },
                { user2: user2.telegramId }
            ]
        });

        if (existingMatch) {
            console.log("One or both users are already in an active match.");
            return null; // Prevent duplicate or overlapping matches
        }

        // Create a new match
        const newMatch = new Match({
            user1: user1.telegramId,
            user2: user2.telegramId
        });

        await newMatch.save();
        console.log(`Match created: ${user1.telegramId} <-> ${user2.telegramId}`);
        return newMatch;
    } catch (error) {
        console.error("Error creating a unique match:", error);
        return null;
    }
};


module.exports = createMatch;