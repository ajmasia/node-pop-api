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
        const token = req.body.token || req.query.token || req.get('x-access-token');


        if (!token) {
            const err = new Error(i18n.__('No token provided'));
            next(err);
            res.status(401);
            return;
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {

            if (err) {
                next(err);
                res.status(401);
                return;
            }

            // Get user id to be used by next middlewares
            req.apiUserId = decodedToken.sub;

            // Token is ok -> Go to next middleware
            next();

        });
    }
}