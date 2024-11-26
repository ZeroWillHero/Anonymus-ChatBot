const Match = require('./../../../models/Match');

const getMatch = async (match_id) => {
    try {
        const match = await Match.findOne({ _id : match_id });

        return match

    }catch(error) {
        console.log("Error" ,error);
    }
    
}

module.exports = getMatch;