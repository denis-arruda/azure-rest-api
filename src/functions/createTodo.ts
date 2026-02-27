import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { MongoClient, ObjectId } from "mongodb";

const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_NAME = process.env.DATABASE_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

export async function createTodo(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    let todo;
    try {
        todo = await request.json();
    } catch {
        return {
            status: 400,
            body: "Invalid JSON body"
        };
    }

    // Optionally remove id/_id if present in the request body
    delete todo.id;
    delete todo._id;

    const client = new MongoClient(DATABASE_URL!);
    try {
        const database = client.db(DATABASE_NAME);
        const todoCollection = database.collection(COLLECTION_NAME);
        const result = await todoCollection.insertOne(todo);
        return {
            status: 201,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: result.insertedId, ...todo })
        };
    } catch (err) {
        context.error("Error creating todo:", err);
        return {
            status: 500,
            body: "Internal server error"
        };
    } finally {
        await client.close();
    }
}

app.http('createTodo', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'todos',
    handler: createTodo
});
