const Match = require('./../../../models/Match');

const deleteMatch = (match_id) => {
    try {
        const match = Match.deleteOne({ _id: match_id });
        if (match) {
            console.log("Match deleted");

        }
        return match;
    } catch (error) {
        console.log("Error", error);
    }
}

module.exports = deleteMatch;