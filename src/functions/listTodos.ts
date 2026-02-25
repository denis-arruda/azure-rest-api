import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function listTodos(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    return { body: `dummy response` };
};

app.http('listTodos', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'todos',
    handler: listTodos
});
