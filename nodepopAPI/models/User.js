'use strict';

/**
 * User model data
 */

 // Require mongoose library
const mongose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Define ad schema
const userSchema = mongose.Schema({
    name: { type: String, index: true },
    displayName: { type: String, index: true },
    email: { type: String, unique: true, index: true, lowercase: true },
    // { select: false } avoid sending the password to the user when doing get request
    password: { type: String, index: true, select: false }, 
    avatar: { type: String, index: true },
    singupDate: { type: date, default: Date.now() },
    lastLoging: Date
});

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
userSchema.methods.gravatar = function() {
    if (!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`;
    const md5 = crypto.createHash('md5').update(this.email) .digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=200&d=retro`;   
}

// Create model
const User = mongose.model('User', userSchema);

// Export model
module.exports = User;

