const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    }
})

//add on fields for username, password, and mongoose connection
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);