'use strict';

/**
 * Users controller
 */

const User = require('../../models/User');


class UserController {

    // Sign Up middleware
    // TODO: Verify existing duplicate email or user name
    async singUp (req, res, next) {
        try {
            const newUser = new User(req.body);
            newUser.password = await User.hashPassword(newUser.password);
            newUser.avatar = await User.getGravatar(newUser.email);
            const userSaved = await newUser.save(newUser);

            res.json({
                success: true,
                result: newUser
            });
        
            // Status server 201: New data created
            res.status(201);

        } catch(err) {
            return next(err);
        }    
    }

    // Sing In middelware

    // Users list middelware


}

module.exports = new UserController();