import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;


if (!process.env.MONGO_DB) {
  throw new Error('Please add your MongoDB URI to the .env file');
}

const uri: string = process.env.MONGO_DB;
const options = {};

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the MongoClient instance is not recreated.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}

export async function getCollection(collectionName: string): Promise<Collection> {
  const db = await getDatabase();
  return db.collection(collectionName);
}

export default getDatabase;
