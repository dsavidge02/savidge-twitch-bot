const { MongoClient, ObjectId } = require('mongodb');

// READING IN ENV VARIABLES
require('dotenv').config();
const mongoUsername = process.env.MONGO_DB_USERNAME;
const mongoPassword = process.env.MONGO_DB_PASSWORD;

if (!mongoUsername || !mongoPassword) {
    throw new Error('Missing MONGO_DB_USERNAME or MONGO_DB_PASSWORD');
}

const mongoUri = `mongodb+srv://${mongoUsername}:${mongoPassword}@initial-web-app.mrfqssl.mongodb.net/?retryWrites=true&w=majority&appName=initial-web-app`;

async function getUsers() {
    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const db = client.db('auth');
        const collection = db.collection('users');
        const result = await collection.find().toArray();
        return result;
    }
    catch (err) {
        console.error(`Error fetching data from ${dbName}.${collectionName}`, err);
        throw new Error('An error occurred while fetching data');
    }
    finally {
        await client.close();
    }
};

async function refreshUser(user) {
    if (!user?._id) throw new Error('Invalid user object');

    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const db = client.db('auth');
        const collection = db.collection('users');
        const result = await collection.updateOne(
            { _id: user._id },
            { $set: { refreshToken: user.refreshToken } }
        );

        if (result.matchedCount === 0) {
            throw new Error(`User not found`);
        }

        return result;
    }
    catch (err) {
        console.error('Error updating refresh token:', err.message);
        throw err;
    }
    finally {
        await client.close();
    }
};

async function addUser(user) {
    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const db = client.db('auth');
        const collection = db.collection('users');

        const result = await collection.insertOne(user);
        return result;
    }
    catch (err) {
        console.error(`Error adding user: ${user.username} - `, err.message);
        throw err;
    }
    finally {
        await client.close();
    }
}

module.exports = { getUsers, refreshUser, addUser }