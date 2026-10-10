import { MongoClient } from "mongodb";

let cachedClient;

export async function getDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI no está configurado.");
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI);
  }

  await cachedClient.connect();
  return cachedClient.db(process.env.MONGODB_DB || "219labs");
}

export async function getLeadsCollection() {
  const db = await getDatabase();
  return db.collection(process.env.MONGODB_LEADS_COLLECTION || "leads");
}
