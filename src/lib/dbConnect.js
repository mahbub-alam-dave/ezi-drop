
export const collectionName = {
    users: "users",
    orders: "orders"
}

export const dbConnect = () => {
    
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

return client.db(process.env.DB_NAME).collection(collectionName)

}