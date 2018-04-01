'use strict';

/**
 * Create thumbnails service
 */

 const Cote = require('cote');
 const thunbnail = require('jimp');
 const responder = new Cote.responder({ name: 'thunbnail service' });

// Create responder {req.image} -> image base to create thunbnail
responder.on('create thunbnail', (req, done) => {
    console.log('Thubnail requested', req.image);
    const result = 

    done(result);

});