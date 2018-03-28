'use strict';

/**
 * User model data
 */

 // Require mongoose library
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// User schema
const userSchema = mongoose.Schema({
    user: { type: String, index: true, unique: true },
    displayName: { type: String, index: true },
    email: { type: String, unique: true, index: true, lowercase: true },
    // { select: false } avoid sending the password to the user when doing get request
    password: { type: String, index: true, select: false },
    avatar: { type: String, index: true },
    singupDate: { type: Date, default: Date.now() },
    lastLoging: Date
});


/**
 * Statics methods
 */

// Password hash method
userSchema.statics.hashPassword = function (plain) {
    return new Promise( (resolve, reject) => {
        bcrypt.hash(plain, 10, function(err, hash) {
            if (err) {
                reject(err);
                return;
            }
            resolve(hash);
        });
    });
}

// Gravatar method
userSchema.statics.getGravatar = function (email) {
    return new Promise( (resolve, reject) => {
        let gravatar;
        if (!email) {
        gravatar = `https://gravatar.com/avatar/?s=200&d=retro`;

        } else {
            const md5 = crypto.createHash('md5').update(email) .digest('hex');
            gravatar = `https://gravatar.com/avatar/${md5}?s=200&d=retro`;
        }

        resolve(gravatar);

    })
}


// Create model
const User = mongoose.model('User', userSchema);

// Export model
module.exports = User;

