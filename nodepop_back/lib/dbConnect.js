'use strict';

const mongoose = require('mongoose');
const connection = mongoose.connection;

// error event control
connection.on('error', err => {
    console.log('Connection error:', err);
    // stop app
    process.exit(1);
});

// once opene event
connection.once('open', () => {
    console.log('Connected to MongoDB on', mongoose.connection.name);
})

// connect to MongoDB
mongoose.connect('mongodb://localhost/nodepop');