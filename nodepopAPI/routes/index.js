/**
 * NodeAPI index router with filters
 */
'use strict';

var express = require('express');
var router = express.Router();

const Ad = require('../models/Ad');
var appLib = require('../lib/appLib');

/* GET home page. */
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
      const fields = req.query.fields;
      
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
      res.render('index', { 
        title: 'NodePop',
        docs: docs
      });

      // Status server 204: Content not found
      if ( docs.length === 0 ) {
          res.status(204);
      }

  } catch(err) {
      return next(err);
  }
});

module.exports = router;
