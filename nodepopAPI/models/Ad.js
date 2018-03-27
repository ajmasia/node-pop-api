'use strict';

/**
 * Ad model data
 */

 // Require mongoose library
const mongoose = require('mongoose');

// Define ad schema
const adSchema = mongoose.Schema({
    name: { type: String, index: true },
    forSale: { type: Boolean, index: true },
    price: { type: Number, index: true },
    image: String,
    tags: { type: [String], index: true }
});

// Create static method model by async function
adSchema.statics.list = function (filter, skip, limit, sort, fields, callback) {
    
    // get query whithout execute it
    const query = Ad.find(filter);
    
    // get query parameters 
    query.skip(skip);
    query.limit(limit);
    query.sort(sort);
    query.select(fields);
    
    // return execute query
    return query.exec(callback);
}

// Create model
const Ad = mongoose.model('Ad', adSchema);

// Expor model
module.exports = Ad;
