'use strict';

const config = require('../config');
const mongoose = require('mongoose');
const connection = mongoose.connection;

// error event control
connection.on('error', err => {
    console.log('MongoDB connection error:', err);
    // stop app
    process.exit(1);
});

// once opene event
connection.once('open', () => {
    console.log('Connected successfully to database on', config.mongoURL + config.db);
})

// connect to MongoDB
mongoose.connect(config.mongoURL + config.db);