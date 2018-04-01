'use strict';

/**
 * i18n module configuration
 */

// Require dependences
const i18n = require('i18n');
const path = require('path');

// Var configuration for development state
const env = process.env.NODE_ENV || 'development';
const autoReload = env === 'development';
const updateFile = env === 'development';
const syncFile = env === 'development';

module.exports = function (defaultLocale) {
    
    defaultLocale = defaultLocale || 'en';

    i18n.configure({
        locales: ['en', 'es'],
        directory: path.join(__dirname, '../locales'),
        defaultLocale: defaultLocale,
        // Reload locales files if there are changes
        autoReload: autoReload,
        // Create inexisting locales files
        updateFiles: updateFile,
        // Sync changes
        syncFiles: syncFile,
        // Parameter to request language config 
        queryParameter: 'lang',
        // Use locale from this cookie
        cookie: 'nodeapi-lang' 
    });

    i18n.setLocale('en');

    // Return i18n object configurated
    return i18n;
}