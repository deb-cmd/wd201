// completeTodo.js
var argv = require("minimist")(process.argv.slice(2));
const db = require("./models/index"); // Correct path to models/index.js

const markAsComplete = async (id) => {
  try {
    await db.Todo.markAsComplete(id);
    console.log(`Marked todo with ID ${id} as complete.`); // Add confirmation
  } catch (error) {
    console.error(`Error completing todo ID ${id}:`, error.message);
  }
};

(async () => {
  const { id } = argv;
  if (id === undefined) {
    // Check for undefined specifically
    console.error("Error: Need to pass an id.");
    console.error("Sample command: node completeTodo.js --id=1");
    process.exit(1);
  }

  const todoId = parseInt(id, 10); // Parse id to integer

  if (!Number.isInteger(todoId) || todoId <= 0) {
    // Check if it's a positive integer
    console.error("Error: The id needs to be a positive integer.");
    process.exit(1);
  }

  try {
    await markAsComplete(todoId);
    console.log("\nUpdated Todo list:");
    await db.Todo.showList(); // Show the list after marking complete
  } catch (error) {
    console.error("Operation failed:", error.message);
    process.exit(1);
  }
})();
