/**
 * MongoDB initialization script
 */

'use strict';

const mongoDB = require('mongodb').MongoClient;
const fileSystem = require('fs');

async function dbReset() {
    try {
        try {
            const url = 'mongodb://localhost/nodepop';
            console.log('Trying to connect to the database');
            var dbCon = await mongoDB.connect(url);
            console.log('Connected to database on', url);
        } catch(err) {
            console.log('MongoDB connection error:', err);
            process.exit(1);
        }

        await resetDatabase(dbCon, 'ads', '../test_data/testData.json');

        console.log('Clossing mongoDb connection');
        await dbConnect.close();
    } catch(err) {
        console.log('An error ocurred:', err);
        process.exit(1);
    }
}

async function resetDatabase (con, collectionName, dataFile) {
    try {
        console.log('Trying to delete colletion:', collectionName);

        try {
            await con.collection(collectionName).drop();
            console.log(`Collection ${collectionName} deleted`);
        } catch(err) {
            if ( err.message !== 'ns not found' ) {
                throw err;
            }
        }

        try {
            console.log('Reading data file from:', dataFile);
            var jsonData = JSON.parse(fileSystem.readFileSync(dataFile, 'utf8'));
        } catch(err) {
            console.log('An error ocurred trying read data from file:', err);
        }

        try {
            console.log(`Creating new docs in ${collectionName} collection`);
            const fileCollectionName = Object.keys(jsonData)[0];
            await con.collection(collectionName).insertMany(jsonData[fileCollectionName]);

        } catch(err) {
            console.log(`An error ocurred creating new docs in ${collectionName} collection:`, err);
        }

    } catch(err) {
        throw err;
    }
}

dbReset();