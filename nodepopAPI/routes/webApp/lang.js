'use strict';

/**
 * lang.html router
 */

 const express = require('express');
 const router = express.Router();

 router.get('/:locale', (req, res, next) => {

    // Get lang from params
    const locale = req.params.locale;

    // Save return page
    const refererPage = req.get('referer');

    // Create lang cookie
    res.cookie('nodeapi-lang', locale, { maxAge: 900000 });
  
    // Redirect to refered page
    res.redirect(refererPage);

 });

 module.exports = router;