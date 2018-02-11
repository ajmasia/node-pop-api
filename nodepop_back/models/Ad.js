'use strict';

// ads model
// require mongoose library
const mongoose = require('mongoose');

// define ad schema
const adSchema = mongoose.Schema({
    name: { type: String, index: true },
    forSale: { type: Boolean, index: true },
    price: Number,
    image: String,
    tags: { type: [String], index: true }
});

// create model
const Ad = mongoose.model('Ad', adSchema);

// expor model
module.exports = Ad;
