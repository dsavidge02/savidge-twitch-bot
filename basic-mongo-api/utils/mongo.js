const axios = require('axios');
const { MongoClient, ObjectId } = require('mongodb');

// READING IN ENV VARIABLES
require('dotenv').config();
const mongoUsername = process.env.MONGO_DB_USERNAME;
const mongoPassword = process.env.MONGO_DB_PASSWORD;

if (!mongoUsername || !mongoPassword) {
    throw new Error('Missing MONGO_DB_USERNAME or MONGO_DB_PASSWORD');
}

const mongoUri = `mongodb+srv://${mongoUsername}:${mongoPassword}@initial-web-app.mrfqssl.mongodb.net/?retryWrites=true&w=majority&appName=initial-web-app`;

async function fetchCollection(dbName, collectionName) {
    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.find().toArray();
        return result;
    }
    catch (error) {
        console.error(`Error fetching data from ${dbName}.${collectionName}`, error);
        throw new Error('An error occurred while fetching data');
    }
    finally {
        await client.close();
    }
};

module.exports = { fetchCollection };