import { MongoClient, Db, Collection } from 'mongodb';


const globalForMongo = global as unknown as NodeJS.Global;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGO_DB) {
  throw new Error('Please add your MongoDB URI to the .env file');
}

const uri: string = process.env.MONGO_DB;
const options = {};

if (process.env.NODE_ENV === 'development') {

  if (!globalForMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalForMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalForMongo._mongoClientPromise;
} else {

  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}

export async function getCollection(
  collectionName: string
): Promise<Collection> {
  const db = await getDatabase();
  return db.collection(collectionName);
}

export default getDatabase;
