import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { MongoClient, ObjectId } from "mongodb";

const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_NAME = process.env.DATABASE_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

export async function getTodo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const id = request.params.id;
    if (!id) {
        return {
            status: 400,
            body: "Missing id parameter"
        };
    }

    const client = new MongoClient(DATABASE_URL!);
    try {
        const database = client.db(DATABASE_NAME);
        const todoCollection = database.collection(COLLECTION_NAME);
        const todo = await todoCollection.findOne({ _id: new ObjectId(id) });
        if (!todo) {
            return {
                status: 404,
                body: "Todo not found"
            };
        }
        // Replace _id with id in the response
        const { _id, ...rest } = todo;
        return {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: _id, ...rest })
        };
    } catch (err) {
        context.error("Error retrieving todo:", err);
        return {
            status: 500,
            body: "Internal server error"
        };
    } finally {
        await client.close();
    }
}

app.http('getTodo', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'todos/{id}',
    handler: getTodo
});
