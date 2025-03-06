import { MongoClient } from 'mongodb';

// global.d.ts
declare global {
  let _mongoClientPromise: Promise<MongoClient> | undefined;
}

export {};
