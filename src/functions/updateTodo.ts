import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { MongoClient, ObjectId } from "mongodb";

const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_NAME = process.env.DATABASE_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

export async function updateTodo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const id = request.params.id;
    if (!id) {
        return {
            status: 400,
            body: "Missing id parameter"
        };
    }

    let update;
    try {
        update = await request.json();
    } catch {
        return {
            status: 400,
            body: "Invalid JSON body"
        };
    }

    const client = new MongoClient(DATABASE_URL!);
    try {
        const database = client.db(DATABASE_NAME);
        const todoCollection = database.collection(COLLECTION_NAME);
        const result = await todoCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: update }
        );
        if (result.matchedCount === 0) {
            return {
                status: 404,
                body: "Todo not found"
            };
        }
        // Return the updated document (read it back)
        const updated = await todoCollection.findOne({ _id: new ObjectId(id) });
        if (!updated) {
            return {
                status: 404,
                body: "Todo not found after update"
            };
        }
        const { _id, ...rest } = updated;
        return {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: _id, ...rest })
        };
    } catch (err) {
        context.error("Error updating todo:", err);
        return {
            status: 500,
            body: "Internal server error"
        };
    } finally {
        await client.close();
    }
}

app.http('updateTodo', {
    methods: ['PUT', 'PATCH'],
    authLevel: 'anonymous',
    route: 'todos/{id}',
    handler: updateTodo
});
