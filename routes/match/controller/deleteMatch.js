const Match = require('./../../../models/Match');

const deleteMatch = async (telegram_id) => {
    try {
        const match = await Match.findOne({
            $or: [{ user1: telegram_id }, { user2: telegram_id }]
        });

        if (match) {
            await match.deleteOne({ _id: match._id });
            console.log("Match deleted");
        }
        return match;
    } catch (error) {
        console.log("Error", error);
    }
}

module.exports = deleteMatch;