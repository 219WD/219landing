import { MongoClient } from "mongodb";

let cachedClient;
let connectionPromise;

export async function getDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI no está configurado.");
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGODB_URI, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 8000,
      maxPoolSize: 8,
      retryWrites: true,
    });
  }

  if (!connectionPromise) {
    connectionPromise = cachedClient.connect().catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  await connectionPromise;
  return cachedClient.db(process.env.MONGODB_DB || "219labs");
}

export async function getLeadsCollection() {
  const db = await getDatabase();
  return db.collection(process.env.MONGODB_LEADS_COLLECTION || "leads");
}

export async function getEmailTemplatesCollection() {
  const db = await getDatabase();
  return db.collection(process.env.MONGODB_EMAIL_TEMPLATES_COLLECTION || "emailMarketingTemplates");
}

export async function getEmailCampaignSendsCollection() {
  const db = await getDatabase();
  return db.collection(process.env.MONGODB_EMAIL_SENDS_COLLECTION || "emailMarketingSends");
}
