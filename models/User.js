const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    username: { type: String },
    language: { type: String, default: 'en' },
    is_online : {type: Boolean,default:false},
    preferences: {
        gender: { type: String ,default: 'all' },
    },
    subscription: { 
        type: {
            type: String,
            default: 'free'
        },
        time : {
            type: Number,
            default : 0
        },

        name : {
            type: String,
            default: 'free'
        },

        amount : {
            type : Number,
            default : 0
        }
    },

    is_matched : {
        type : Boolean,
        default : false
    }
}, {
    timestamps : true
});

const User = mongoose.model('User',userSchema);

module.exports = User;
