
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    id: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);
