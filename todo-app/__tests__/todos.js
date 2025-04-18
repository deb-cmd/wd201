// __tests__/todos.js
const request = require("supertest");
const db = require("../models/index"); // db object holds the models
const app = require("../app");

let server, agent;

describe("Todo Application", function () {
  beforeAll(async () => {
    // Ensure we use the test environment config
    process.env.NODE_ENV = 'test';
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {}); // Use a specific port
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close(); // Close the db connection
      await server.close(); // Close the express server
    } catch (error) {
      console.log(error);
    }
  });

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("Marks a todo with the given ID as complete", async () => {
    const createResponse = await agent.post("/todos").send({
      title: "Buy cheese",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parsedCreateResponse = JSON.parse(createResponse.text);
    const todoID = parsedCreateResponse.id;

    expect(parsedCreateResponse.completed).toBe(false);

    const markCompleteResponse = await agent
      .put(`/todos/${todoID}/markAsCompleted`) // Corrected casing
      .send();
    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);

    // Optional: Verify by fetching again
    const fetchResponse = await agent.get(`/todos/${todoID}`);
    const parsedFetchResponse = JSON.parse(fetchResponse.text);
    expect(parsedFetchResponse.completed).toBe(true);
  });

  test("Fetches all todos in the database using /todos endpoint", async () => {
    // Reset DB or count existing items before adding new ones for reliable count
    // FIX: Access Todo model via the db object
    await db.Todo.destroy({ where: {} }); // Clear existing todos for a clean slate in this test

    const todo1 = await agent.post("/todos").send({
      title: "Buy xbox",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const todo2 = await agent.post("/todos").send({
      title: "Buy ps3",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const response = await agent.get("/todos");
    const parsedResponse = JSON.parse(response.text);

    expect(response.statusCode).toBe(200);
    expect(parsedResponse.length).toBe(2); // Expecting 2 after clearing
    // Find the ps3 todo (order isn't guaranteed, so check titles)
    const ps3Todo = parsedResponse.find(todo => todo.title === "Buy ps3");
    expect(ps3Todo).toBeDefined();
    expect(ps3Todo.title).toBe("Buy ps3");
  });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    const createResponse = await agent.post("/todos").send({
      title: "Todo to be deleted",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(createResponse.statusCode).toBe(200);
    const parsedCreateResponse = JSON.parse(createResponse.text);
    const todoID = parsedCreateResponse.id;

    const deleteResponse = await agent.delete(`/todos/${todoID}`);
    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.text).toBe('true'); // Check plain text response

    // Verify it's gone
    const fetchResponse = await agent.get(`/todos/${todoID}`);
    expect(fetchResponse.statusCode).toBe(404); // Expecting 404 Not Found

    // Try deleting again
    const deleteAgainResponse = await agent.delete(`/todos/${todoID}`);
    expect(deleteAgainResponse.statusCode).toBe(200);
    expect(deleteAgainResponse.text).toBe('false'); // Expecting false this time
  });
});