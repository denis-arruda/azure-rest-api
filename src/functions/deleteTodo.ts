import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { MongoClient, ObjectId } from "mongodb";

const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_NAME = process.env.DATABASE_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

export async function deleteTodo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        const result = await todoCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return {
                status: 404,
                body: "Todo not found"
            };
        }
        return {
            status: 204,
            body: undefined
        };
    } catch (err) {
        context.error("Error deleting todo:", err);
        return {
            status: 500,
            body: "Internal server error"
        };
    } finally {
        await client.close();
    }
}

app.http('deleteTodo', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'todos/{id}',
    handler: deleteTodo
});
