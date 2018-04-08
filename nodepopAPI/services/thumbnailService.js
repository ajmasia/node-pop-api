'use strict';

/**
 * Create thumbnails service
 */

const path = require('path');
const cote = require('cote');
const jimp = require('jimp');
const responder = new cote.Responder({ 
     name: 'thumbnail service responder' 
});

// Create responder {req.imageUrl} -> image base to create thumbnail
responder.on('createThumbnail', async req => {
    try {
        console.log('Service: Request from', req.imageUrl);

        const readImage = await jimp.read(req.imageUrl);
        const thumbnail = readImage.scaleToFit(100, 100)     
            .write(path.join(__dirname, '../public/thumbnails/') + 'thumbnail_' + req.imageFile);
        if (thumbnail) {
            console.log(`thumbnail for ${req.imageFile} created successfully`);
            return thumbnail;
        }

    } catch(err) {
        console.log(err);
    }
});