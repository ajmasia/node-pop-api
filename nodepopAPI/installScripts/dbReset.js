'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const readLine = require('readline');
const async = require('async');

const dbConnect = require('../lib/dbConnect');

// Cargamos las definiciones de todos nuestros modelos
const Ad = require('../models/Ad');
const User = require('../models/User');

dbConnect.once('open', async function () {
    try {
        console.log('***********************************');
        console.log('** NodeAPI Database reset script **');
        console.log('***********************************');

        const answer = await askUser('Are you sure you want to empty DB? (no) ');
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      
            // Initialized models
            await initAds();
            await initUsers()
      
        } else {
            console.log('Script aborted!');
        }
        return process.exit(0);

    } catch(err) {
        
        console.log(err);
        return process.exit(1);
    
    }
});

function askUser(question) {
    return new Promise((resolve, reject) => {
        
        const rl = readLine.createInterface({
            input: process.stdin, output: process.stdout
        });
    
        rl.question(question, answer => {
            rl.close();
            resolve(answer);
        });
    
    });
}

async function initAds() {

    await Ad.remove({});
    console.log('Done: Ads deleted');

    // Cargar anuncios.json
    const fileData = process.env.FILE_DATA;

    console.log('Doing: Loading data ...');
    const numLoaded = await Ad.loadJson(fileData);
    console.log(`Result: Everything was fine! ${numLoaded} ads added to ${process.env.DB_NAME}`);

    return numLoaded;

}

async function initUsers() {

    const deletedUsers = await User.deleteMany();
    
    console.log(`Done: Users deleted`);
    const insertedUsers = await User.insertMany([
      { 
        user: 'admin',
        displayName: 'Admin',
        email: 'user@example.com',
        password: await User.hashPassword('1234'),
        avatar: await User.getGravatar('admin@example.com')
      }
    ]);

    console.log(`Result: Everything was fine! ${insertedUsers.length} users added to ${process.env.DB_NAME}`);
  }