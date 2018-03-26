/**
 * Database reset script
 */

'use strict';

// Require dependences

require('dotenv').config();

const mongoClient = require('mongodb').MongoClient;
const fileSystem = require('fs');


( async function() {
  
    let client;
    console.log('Tryint to connect MongoDB ...');
  
    try {
        // Connect to database
        client = await mongoClient.connect(process.env.MONGO_URL);
        console.log('Connected successfully to server on:', process.env.MONGO_URL);
        const db = client.db(process.env.DB_NAME);
    
        // Delete collection
        try {
            await db.collection(process.env.COLLECTION_NAME).drop();
            console.log(`Collection ${process.env.COLLECTION_NAME} deleted`);
        } catch(err) {
            if (err.message !== 'ns not found') {
                throw err;
            }
        }

        // Read file data from process.env.FILE_DATA
        try {
            console.log('Reading data file from:', process.env.FILE_DATA);
            var jsonData = JSON.parse(fileSystem.readFileSync(process.env.FILE_DATA, 'utf8'));
            console.log('JSON data readed successfully from file');
        } catch(err) {
            console.log('An error ocurred trying read data from file:', err);
        }

        // Create new docs in database
        try {
            console.log(`Creating new docs in ${process.env.COLLECTION_NAME} collection`);
            const fileCollectionName = Object.keys(jsonData)[0];
            await db.collection(process.env.COLLECTION_NAME).insertMany(jsonData[fileCollectionName]);

        } catch(err) {
            console.log(`An error ocurred creating new docs in ${process.env.COLLECTION_NAME} collection:`, err);
        }
  
    } catch (err) {
        console.log('MongoDB connection error:', err);
        process.exit(1);
    }
  
    // Close connection
    console.log('Clossing mongoDb connection');
    client.close();
  })();