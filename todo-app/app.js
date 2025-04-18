//app.js
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.send("Hello World");
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE
  try {
    // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
    const todos = await Todo.findAll();
    // Then, we have to respond with all Todos, like:
    return response.json(todos); // Use json for consistency
  } catch (error) {
    console.log(error);
    // Return an appropriate error status, 500 for server errors seems suitable
    return response.status(500).json({ error: "Failed to retrieve todos" });
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    // If todo is not found, findByPk returns null. Send 404 in that case.
    if (!todo) {
        return response.status(404).json({ error: "Todo not found" });
    }
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  // Handle case where todo is not found before trying to update
  if (!todo) {
    return response.status(404).json({ error: "Todo not found" });
  }
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE
  try {
    const todoId = request.params.id;
    // First, we have to query our database to delete a Todo by ID.
    // Todo.destroy returns the number of rows deleted.
    const deletedRowCount = await Todo.destroy({
      where: {
        id: todoId,
      },
    });
    // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
    // If deletedRowCount is 1, it means deletion was successful. If 0, it means todo was not found.
    response.send(deletedRowCount > 0);
  } catch (error) {
    console.log(error);
    // Send a generic server error status, or 422 like other routes
    return response.status(422).json(error);
  }
});

module.exports = app;