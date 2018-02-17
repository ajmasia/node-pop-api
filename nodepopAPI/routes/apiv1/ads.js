/**
 * NodeAPI ads router
 */

'use strict';

// Require dependences
const appLib = require('../../lib/appLib');
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

// Require data model
const Ad = require('../../models/Ad');

// List ads middleware
// GET method
router.get('/', async (req, res, next) => {
   
    try {
        // Get request parameters
        const name = req.query.name;
        const forSale = req.query.forsale;
        const tags = req.query.tag;
        const price = req.query.price;
        const skip = parseInt(req.query.skip);
        const limit = parseInt(req.query.limit);
        const sort = req.query.sort;
        const fields = req.query.field;
        
        // Build filter query with parameters
        const filter = {};
        
        // Filter by name validation
        if ( typeof name !== 'undefined' ) {
            (name !== '' ) ? filter.name = { $regex: '.*' + name + '.*', $options: 'i'} : filter.name = name;
        }

        // Filter by forsale validation
        if ( typeof forSale !== 'undefined' ) filter.forSale = appLib.parseBoolean(forSale);
        
        // Filter by tags validation
        if ( typeof tags !== 'undefined' ) {
            if ( Array.isArray(tags) ) {
                filter.tags = { $in: tags };
            } else {
                filter.tags = tags;
            }
        }
        
        // Filter by price validation
        if ( typeof price !== 'undefined'  ) {

            const priceRange = price.split('-');
           
            if ( priceRange.length == 1 ) { 
                filter.price = price;
            }
           
            if ( priceRange.length == 2 ) {
                if ( priceRange[0] == '' ) {
                    filter.price = { $lte: priceRange[1] };
                } else if ( priceRange[1] == '' ) {
                    filter.price = { $gte: priceRange[0] };
                } else if ( priceRange[0] < priceRange[1] ) {
                    filter.price = { $gte: priceRange[0], $lte: priceRange[1] }
                } else if ( priceRange[0] > priceRange[1] ) {
                    filter.price = { $gte: priceRange[1], $lte: priceRange[0] }
                }
            }
        }

        if ( price == 'null' || price == '0') filter.price = null;
        
        // Run query
        const docs = await Ad.list(filter, skip, limit, sort, fields);
       
        // Query response
        res.json({
            success: true,
            result: docs
        });

        // Status server 204: Content not found
        if ( docs.length === 0 ) {
            res.status(204);
        }

    } catch(err) {
        return next(err);
    }
});

// Get all tags middleware
// GET Metthod

router.get('/tags', async (req, res, next) => {
    try {
        const tags = await Ad.distinct('tags');
        res.json({
            success: true,
            result: tags
        });
        
        // Status server 204: Content not found
        if ( tags.length === 0 ) {
            res.status(204);
        }

    } catch(err) {
        return next(err);
    }
})

// Get add by id middleware
// GET method
router.get('/:id', async (req, res, next) => {
    try {
        const _id = req.params.id;
        const doc = await Ad.find({_id: _id});
        res.json({
            success: true,
            result: doc
        });
    
    // Status server 204: Content not found
    if ( doc.length === 0 ) {
        res.status(204);
    }
        
    } catch(err) {
        return next(err);
    }
})

// Create ad middleware
// POST method
// Todo: Validation
router.post('/', [],async (req, res, next) => {
    try {

        // Create new ad data using his model
        const newAd = new Ad(req.body);

        const adSaved = await newAd.save(newAd);

        res.json({
            success: true,
            result: adSaved
        });
        
        // Status server 201: New data created
        res.status(201);

    } catch(err) {
        return next(err);
    }

});

// Update ad middleware
// PUT method
// Todo: Validation
router.put('/:id', async (req, res, next) => {
    try {
        const _id = req.params.id;
        const data = req.body;

        const updatedAd = await Ad.findByIdAndUpdate(_id, data, { new: true });
        res.json({
            success: true,
            result: updatedAd
        });
    } catch(err) {
        return next(err);
    }
})

// Delete add middleware
// DELETE method
router.delete('/:id', async (req, res, next) => {
    try {
        const _id = req.params.id;
        await Ad.remove({_id: _id}).exec(); 
        res.json({
            success: true,
        });
    } catch(err) {
        return next(err);
    }
})

module.exports = router;