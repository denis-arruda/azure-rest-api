
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { MongoClient } from "mongodb";

export async function listTodos(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const DATABASE_URL = process.env.DATABASE_URL;
    const DATABASE_NAME = process.env.DATABASE_NAME;
    const COLLECTION_NAME = process.env.COLLECTION_NAME;
    
    context.log(`Http function processed request for url "${request.url}"`);

    // Read connection string from environment variable
    const client = new MongoClient(DATABASE_URL!);

    try{
      const database = client.db(DATABASE_NAME);
      const todoCollection = database.collection(COLLECTION_NAME);

        const results = await todoCollection.find({}).toArray();

        return {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(results).replace(/_id/g, "id")
        };

        } finally {
    await client.close();
  }
    
};

app.http('listTodos', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'todos',
    handler: listTodos
});
