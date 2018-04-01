'use strict';

/**
 * Multer upload config
 */

 // Require dependences
const multer = require('multer');
const path = require('path');

// Create storage
const storage = multer.diskStorage({
    // Where images will be saved
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    // Image fila pattern
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
    }
});

module.exports = multer({ storage: storage });
