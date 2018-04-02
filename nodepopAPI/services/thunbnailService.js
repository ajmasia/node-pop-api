'use strict';

/**
 * Create thumbnails service
 */

const path = require('path');
const cote = require('cote');
const jimp = require('jimp');
const responder = new cote.Responder({ 
     name: 'thunbnail service responder ' 
});

// Create responder {req.imageUrl} -> image base to create thunbnail
responder.on('createThunbnail', async req => {
    try {
        console.log('Service: Request from', req.imageUrl);

        const readImage = await jimp.read(req.imageUrl);
        const thunbnail = readImage.scaleToFit(100, 100)     
            .write(path.join(__dirname, '../public/thunbnails/') + 'thunbnail_' + req.imageFile);
        if (thunbnail) {
            console.log(`Thunbnail for ${req.imageFile} created successfully`);
            return thunbnail;
        }

    } catch(err) {
        console.log(err);
    }
});