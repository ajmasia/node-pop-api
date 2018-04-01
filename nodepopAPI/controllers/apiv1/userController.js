'use strict';

/**
 * Users controller
 */

 // Require dependences
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const i18n = require('../../lib/i18nConfig')();

class UserController {

    // Users list middleware
    async usersList (req, res, next) {
        
        try {

            // Get request parameters
            const user = req.query.user;
            const skip = parseInt(req.query.skip);
            const limit = parseInt(req.query.limit);
            const sort = req.query.sort;
            const fields = req.query.field;
            
            // Build filter query with parameters
            const filter = {};

            // Filter by name validation
            if ( typeof user !== 'undefined' ) {
                (user !== '' ) ? filter.user = { $regex: '.*' + user + '.*', $options: 'i'} : filter.user = user;
            }

            const docs = await User.list(filter, skip, limit, sort, fields);

            // Query response
            res.json({
                success: true,
                result: docs
            });

            // Status server 204: Content not found
            if ( docs.length === 0 ) {
                res.status(204);
            }
            // res.send('respond with a resource');

        } catch(err) {
            return next(err);
        }
    }

    // Sign Up middleware
    async singUp (req, res, next) {
        
        // Verify is user already exist
        try {

            const userEmail = req.body.email;
            const userName = req.body.user;
    
            const existingUser = await User.find({$or: [ {name: userName}, {email: userEmail} ]});
            console.log(existingUser.length);
            
            if (existingUser.length != 0) {
                res.status(409).send({ 
                    success: false,
                    result: i18n.__('User already exist') 
                });
                return;
            }

        } catch(err) {
            return next(err);
        }
        
        // Create new user
        try {

            const newUser = new User(req.body);
            newUser.password = await User.hashPassword(newUser.password);
            newUser.avatar = await User.getGravatar(newUser.email);
            const userSaved = await newUser.save(newUser);
            
            res.json({
                success: true,
                result: userSaved
            });
            
            // Status server 201: New data created
            res.status(201);

        } catch(err) {
            return next(err);
        }    
    }

    /** 
    * Sing in middleware
    * Method: POST
    * Route: /apiv1/login
    * TODO: Implement save laslLogin date
    */
    async singIn (req, res , next) {

        try {
            
            // Get user data
            const email = req.body.email;
            const password = req.body.password;

            // Search user by email
            const existingUser = await User.findOne({ email: email }).select('_id password displayName');

            // Verify if existing user is true and his password is ok
            if ( !existingUser || !await bcrypt.compare(password, existingUser.password) ) {
                res.status(401);
                res.json({
                    success: false,
                    result: i18n.__('Opps! Invalid credentials!')
                });
                return;
            }

            // User is ok -> Create token for this authenticate user
            const payload = {
                sub: existingUser._id,
                iat: moment().unix(),
                exp: moment().add(process.env.JWT_EXP_TIME, process.env.JWT_EXP_UNIT).unix()
            }
            
            // Create token wint jsonwebtoken
            jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
                if (err) {
                    return next(err);
                }
                res.json({
                    success: true,
                    result: `Wellcome to NodePop ${existingUser.displayName}`,
                    token: token
                });
            });

        } catch(err) {
            return next(err);
        }
    }

    // Delete user middleare
    async deleteUser (req, res, nest) {
        try {

            const _id = req.params.id;
            await User.remove({_id: _id}).exec();

            res.json({
                success: true,
                result: _id
            })

        } catch(err) {
            return next(err);
        }
    }

    // Update user middleware
    async updateUser (req, res, next) {
        try {

            const _id = req.params.id;
            const userToUpdate = req.body;
            console.log(userToUpdate);

            if ( req.body.password ) {
                userToUpdate.password = await User.hashPassword(userToUpdate.password);
            }

            if ( req.body.email ) {
                userToUpdate.avatar = await User.getGravatar(userToUpdate.email);
            }

            const updatedUser = await User.findByIdAndUpdate(_id, userToUpdate, { new: true });
            
            res. json({
                success: true,
                result: updatedUser
            })

        } catch(err) {
            return next(err);
        }
    }

}

module.exports = new UserController();