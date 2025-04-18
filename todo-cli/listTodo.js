// listTodos.js
const db = require("./models/index"); // Correct path to models/index.js

const listTodo = async () => {
  try {
    await db.Todo.showList();
  } catch (error) {
    console.error("Error listing todos:", error);
  } finally {
    // Optional: Close DB connection if script is meant to exit immediately
    // await db.sequelize.close();
  }
};

(async () => {
  await listTodo();
})();
