const { MongoClient } = require('mongodb');

async function createCollectionWithValidation() {
    // Connection URI
const uri = 'mongodb://localhost:27017';

// Database Name
const dbName = 'EmpDatabase';

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB');

    // Get a reference to the database
    const db = client.db(dbName);

    // Collection Name
    const collectionName = 'employees';

    const collectionExists = await db.listCollections({name: collectionName}).hasNext();
    //hasNext - hasNext() is a method associated with db.listCollections(). 
    //It is part of the MongoDB Node.js driver and is used to check if there are more collections to be iterated over.

    if(!collectionExists) {
        const validationRules = {
            validator: { //This is an object within which you specify the validation rules. In MongoDB, the $jsonSchema operator is used to define JSON Schema validation.
                $jsonSchema: {    //$jsonSchema operator is used to define JSON Schema validation.
                    bsonType: 'object', //Specifies that documents in the collection must be of BSON type 'object', indicating that they are expected to be JSON-like documents.
                    required: ['name', 'age', 'city'], //Specifies that each document must have the fields 'name', 'age', and 'city'. If any of these fields are missing, the document will not pass validation.
                    properties: {
                        name: {bsonType: 'string'}, //Specifies that the 'name' field must be of type string.
                        age: {bsonType: 'int', minimum: 18}, //Specifies that the 'age' field must be of type integer, and its value must be at least 18.
                        city: {bsonType: 'string'}, //Specifies that the 'city' field must be of type string.
                    }
                }
            }
        };
        
        await db.createCollection(collectionName, validationRules);
        console.log(`Collection '${collectionName}' created with validation rules.`);
    } else {
        console.log(`Collection '${collectionName}' already exists.`);
    }
    
    //Inserting a document into the collection
    const result = await db.collection(collectionName).insertOne({
        name:'Anik Acharjee',
        age: 20,
        city: 'New York'
    });

    console.log(`Document inserted with _id: ${result.insertedId}`);
} finally {
    await client.close();
    console.log('Disconnected from MongoDB.');
}
}

createCollectionWithValidation().catch(console.error);