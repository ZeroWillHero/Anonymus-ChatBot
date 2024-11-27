const Match = require('./../../../models/Match');

const updateMatch = async (match_id) => {
    try{
        const updatedMatch = await Match.findOneAndUpdate({ _id : match_id},{status : 'deactive'});
        return updatedMatch;
    }catch(error){
        console.log(error)
    }

    
}

module.exports = updateMatch;