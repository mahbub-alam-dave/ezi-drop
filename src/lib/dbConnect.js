import { MongoClient, ServerApiVersion } from "mongodb";

export  const collectionNames = {
  products: "products",
  users: "users",
  reviews: "reviews",
  messages: "messages", // ✅ added
  riderReview: "riderReview",
};

export const dbConnect = (collectionName) => {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
   client.connect();
  return client.db(process.env.DB_NAME).collection(collectionName);
};
