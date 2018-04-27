const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String },
    admin: Boolean,
    created_at: { type: Date, default: Date.now},
    notes: [{ type: Schema.Types.ObjectId, ref: 'Note'}]
});

userSchema.pre('save', function (next) {
    let user = this;
    bcrypt.genSalt(10, function (err, salt) {
        if(err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);
            user.password = hash;
            next();
        });
    });
});

//compare password for login
userSchema.methods.comparePassword = function(incomingPassword, cb) {
    let user = this;
    bcrypt.comparePassword(incomingPassword, user.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

const user = mongoose.model('User', userSchema);
module.exports = user;
