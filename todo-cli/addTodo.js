// addTodo.js
var argv = require("minimist")(process.argv.slice(2));
const db = require("./models/index"); // Correct path to models/index.js

const createTodo = async (params) => {
  try {
    await db.Todo.addTask(params);
    console.log(`Created todo: "${params.title}"`); // Add confirmation
  } catch (error) {
    console.error("Error adding todo:", error.message); // More specific error
    // Optionally print validation errors if they exist
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err) => console.error(`- ${err.message}`));
    }
  }
};

// Function to calculate the date based on days offset
const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Need to pass an integer as days");
  }
  const today = new Date();
  // Reset time part to avoid timezone issues with DATEONLY comparisons
  today.setHours(0, 0, 0, 0);
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * oneDay);
};

(async () => {
  const { title, dueInDays } = argv;
  if (!title || dueInDays === undefined) {
    console.error("Error: title and dueInDays are required.");
    console.error(
      'Sample command: node addTodo.js --title="Buy milk" --dueInDays=-2 ',
    );
    process.exit(1); // Exit with error code
  }

  // Validate dueInDays is a number before calling getJSDate
  const days = parseInt(dueInDays, 10);
  if (isNaN(days)) {
    console.error("Error: --dueInDays must be an integer.");
    process.exit(1);
  }

  try {
    const dueDate = getJSDate(days);
    await createTodo({ title, dueDate, completed: false });
    console.log("\nUpdated Todo list:");
    await db.Todo.showList(); // Show the list after adding
  } catch (error) {
    console.error("Operation failed:", error.message);
    process.exit(1);
  }
})();
