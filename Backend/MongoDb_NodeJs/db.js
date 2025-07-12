const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;  // Note the correct capitalization

let database;

async function getDatabase() {
    try {
        const client = await mongoClient.connect('mongodb://127.0.0.1:27017', { useUnifiedTopology: true });
        database = client.db('library');

        if (!database) {
            console.log('Db Not Connected');
        }
        return database;
    } catch (error) {
        console.error('Failed to connect to the database', error);
    }
}

module.exports = {
    getDatabase,
    ObjectId  // Exporting the correct ObjectId
};
