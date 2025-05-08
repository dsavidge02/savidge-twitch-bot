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

    async getOne(collectionName, query) {
        if (!query || typeof query !== 'object' || Object.keys(query).length === 0) {
            throw new Error('Query must be an object with at least one key-value pair.');
        }

        try {
            const collection = await this.getCollection(collectionName);
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
                const query = { [field]: value };
                const existingDoc = await this.getOne(collectionName, query);
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

    async updateOne(collectionName, document) {
        if (!document || typeof document !== 'object') {
            throw new Error('Document must be a valid object.');
        }
        
        const { _id, ...updateFields } = document;
    
        if (!_id || Object.keys(updateFields).length === 0) {
            throw new Error('Invalid document.');
        }
    
        try {
            const collection = await this.getCollection(collectionName);
            const filter = { _id: typeof _id === 'string' ? new ObjectId(_id) : _id };
            const update = { $set: updateFields };
    
            const result = await collection.findOneAndUpdate(
                filter,
                update,
                { returnDocument: 'after' }
            );
            
            if (!result) {
                throw new Error(`No document found with _id: ${_id} in ${collectionName}.`);
            }

            return result.value;
        } catch (err) {
            console.error(`Error updating document in ${collectionName}:`, err);
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
    mongoConnector,
    ObjectId
};