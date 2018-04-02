'use strict';



const mongoose = require('mongoose');
const dbConnect = mongoose.connection;

mongoose.Promise = global.Promise;

// Error event control
dbConnect.on('error', err => {
    console.log('MongoDB connection error:', err);
    // stop app
    process.exit(1);
});

// once opene event
dbConnect.once('open', () => {
    console.log('Connected successfully to database on', process.env.MONGO_URL);
})

// connect to MongoDB
mongoose.connect(process.env.MONGO_URL);