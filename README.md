
# azure-rest-api

This project is an Azure Functions REST API for managing Todo items, using MongoDB as the backend database. It provides endpoints to create, read, update, list, and delete Todo items. All database configuration is managed via environment variables for security and flexibility.

## Features
- Create a new Todo
- Retrieve a Todo by ID
- Update a Todo by ID
- Delete a Todo by ID
- List all Todos

## Endpoints
- `POST /todos` - Create a new Todo
- `GET /todos` - List all Todos
- `GET /todos/{id}` - Get a Todo by ID
- `PUT/PATCH /todos/{id}` - Update a Todo by ID
- `DELETE /todos/{id}` - Delete a Todo by ID

## Configuration
Set the following environment variables:
- `DATABASE_URL` - MongoDB connection string
- `DATABASE_NAME` - Database name (e.g., `serverless`)
- `COLLECTION_NAME` - Collection name (e.g., `todos`)

## Usage
Install dependencies and run the project locally using Azure Functions Core Tools.
