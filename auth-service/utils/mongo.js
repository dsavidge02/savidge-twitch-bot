const { MongoClient, ObjectId } = require('mongodb');

class MongoConnector {
    constructor () {
        this.client = null;
        this.db = null;
        this.mongoUri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@initial-web-app.mrfqssl.mongodb.net/?retryWrites=true&w=majority&appName=initial-web-app`;
    }

    async connect() {
        if (!this.client) {
            this.client = new MongoClient(this.mongoUri);
            await this.client.connect();
            console.log('Connected to MongoDB.');
            this.db = this.client.db('auth');
        }
    }

    async getCollection(collectionName = 'users') {
        if (!this.db) {
            throw new Error('Database not initialized. Did you forget to call connect()?');
        }
        return this.db.collection(collectionName);
    }

    async getOne(collectionName, field, value) {
        try {
            const collection = await this.getCollection(collectionName);
            const query = { [field]: value };
            const result = await collection.findOne(query);
            return result;
        }
        catch (err) {
            console.error(`Error finding document in ${collectionName}:`, err);
            throw err;
        }
    }

    async createOne(collectionName, document, unique = []) {
        try {
            for (const field of unique) {
                const value = document[field];
                const existingDoc = await this.getOne(collectionName, field, value);
                if (existingDoc) {
                    throw new Error(`Document with ${field} = ${value} already exists.`);
                }
            }
            const collection = await this.getCollection(collectionName);
            const result = await collection.insertOne(document);
            console.log(`Successfully inserted a new document into ${collectionName}`);
            return result;
        }
        catch (err) {
            console.error(`Error finding document in ${collectionName}:`, err);
            throw err;
        }
    }

    async close() {
        if (this.client) {
            await this.client.close();
            console.log('MongoDB connection closed.');
        }
    }
}

require('dotenv').config();
const mongoConnector = new MongoConnector();
module.exports = {
    mongoConnector
};