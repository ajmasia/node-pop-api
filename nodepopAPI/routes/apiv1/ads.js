'use strict';

const express = require('express');
const router = express.Router();

const Ad = require('../../models/Ad');

// list ads middleware
// GET method

// TODO: Resolve problem with sinmultaneus filter price and forsale
router.get('/', async (req, res, next) => {
    // try {
    //     const docs = await Ad.find();
    //     res.json({
    //         success: true,
    //         result: docs
    //     })
    // } catch(err) {
    //     return next(err);
    // }
    try {
        // data filter
        const name = req.query.name;
        const forSale = req.query.forSale;
        const tags = req.query.tags;
        const price = req.query.price;
        console.log(forSale);
        // create filter object
        const filter = {};
        
        if ( typeof name !== 'undefined' ) filter.name = name;
        if ( typeof forSale !== 'undefined' ) filter.forSale = parseBoolean(forSale);
        if ( typeof tags !== 'undefined' ) {
            if ( Array.isArray(tags) ) {
                filter.tags = {$in: tags};
            } else {
                filter.tags = tags;
            }
          }
        
        if ( typeof price !== 'undefined'  ) {

            const priceRange = price.split('-');
            
            console.log(priceRange.length);
            
            if ( priceRange.length == 1 ) {
                filter.price = price;
            }
            if ( priceRange.length == 2 ) {
                if ( priceRange[0] == '' ) {
                    filter.price = { $lte: priceRange[1] };
                }
                if ( priceRange[1] == '' ) {
                    filter.price = { $gte: priceRange[0] };
                }
                if ( priceRange[0] < priceRange[1] ) {
                    filter.price = { $gte: priceRange[0], $lte: priceRange[1] }
                }
                if ( priceRange[0] > priceRange[1] ) {
                    filter.price = { $gte: priceRange[1], $lte: priceRange[0] }
                }
            }
        }
        // if ( price == 'null' || price == '0') filter.price = null;
    
        console.log(filter);    
        const docs = await Ad.list(filter);
        res.json({
            success: true,
            result: docs
        });
    } catch(err) {
        return next(err);
    }
});

// get add by id middleware
// GET method
router.get('/:id', async (req, res, nest) => {
    try {
        const _id = req.params.id;
        const doc = await Ad.find({_id: _id});
        res.json({
            success: true,
            result: doc
        });
    } catch(err) {
        return next(err);
    }
})

// create ad middleware
// POST method
router.post('/', async (req, res, next) => {
    try {

        // create new ad data using his model
        const newAd = new Ad(req.body);

        const adSaved = await newAd.save(newAd);

        res.json({
            success: true,
            result: adSaved
        });

    } catch(err) {
        return next(err);
    }
});

// update ad middleware
// PUT method
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

    }
})

// delete add middleware
// DELETE method
router.delete('/:id', async (req, res, next) => {
    try {
        const _id = req.params.id;
        await Ad.remove({_id: _id}).exec(); 
        res.json({
            success: true
        });
    } catch(err) {
        return next();
    }
})

// parseBoolena from string function
function parseBoolean (string) {
   
    if ( string.toLowerCase() == 'true' ) return true;
    if ( string.toLowerCase() == 'false' ) return false;
    return undefined;
} 


module.exports = router;