
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    classnum: {
        type: Number,
        required: true
    },
    username :{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    userid: {
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);
