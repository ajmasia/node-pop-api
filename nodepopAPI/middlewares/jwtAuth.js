'use strict';

/** 
 * Authentification middleware
 * This middelware chek if recived token is valid for each API request
 */

// Require dependences
const jwt = require('jsonwebtoken');
const i18n = require('../lib/i18nConfig')();

module.exports = function () {

    return function (req, res, next) {

        // Get token from request
        let token = req.body.token || req.query.token || req.get('x-access-token') || req.get('authorization');


        if (token && token.split(' ').length > 1) {
            token = token.split(' ')[1]
        }
        
        if (!token) {
            const err = new Error(res.__('No token provided'));
            err.status = 401
            return next(err);
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {

            if (err) {
                err.status = 401
                return next(err);
            }

            // Get user id to be used by next middlewares
            req.apiUserId = decodedToken.sub;

            // Token is ok -> Go to next middleware
            next();

        });
    }
}