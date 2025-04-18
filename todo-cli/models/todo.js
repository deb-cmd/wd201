"use strict";
const { Model, Op } = require("sequelize"); // Import Op for operators like lt, gt, eq

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here if needed in the future
    }

    // Method to add a new task
    static async addTask(params) {
      // Ensure dueDate is provided, default completed to false if not present
      return await Todo.create({
        ...params,
        completed: params.completed || false,
      });
    }

    // Method to display the list in the required format
    static async showList() {
      console.log("My Todo list\n");

      console.log("Overdue");
      const overdueItems = await this.overdue();
      overdueItems.forEach((item) => console.log(item.displayableString(true))); // Pass true to show date
      console.log("\n");

      console.log("Due Today");
      const dueTodayItems = await this.dueToday();
      dueTodayItems.forEach((item) => console.log(item.displayableString()));
      console.log("\n");

      console.log("Due Later");
      const dueLaterItems = await this.dueLater();
      dueLaterItems.forEach((item) => console.log(item.displayableString()));
    }

    // Method to get overdue items
    static async overdue() {
      const today = new Date().toISOString().split("T")[0]; // Get date in YYYY-MM-DD format
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today, // Less than today
          },
          completed: false, // Only show incomplete
        },
        order: [["id", "ASC"]], // Order by ID
      });
    }

    // Method to get items due today
    static async dueToday() {
      const today = new Date().toISOString().split("T")[0]; // Get date in YYYY-MM-DD format
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: today, // Equal to today
          },
          // completed status doesn't matter for display here based on example output
        },
        order: [["id", "ASC"]],
      });
    }

    // Method to get items due later
    static async dueLater() {
      const today = new Date().toISOString().split("T")[0]; // Get date in YYYY-MM-DD format
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today, // Greater than today
          },
          completed: false, // Only show incomplete
        },
        order: [["id", "ASC"]],
      });
    }

    // Method to mark an item as complete by its ID
    static async markAsComplete(id) {
      const updatedRowCount = await Todo.update(
        { completed: true },
        {
          where: {
            id: id,
            completed: false, // Optional: only update if not already complete
          },
        },
      );
      // Optional: Check if a row was actually updated
      if (updatedRowCount[0] === 0) {
        console.log(`Todo with ID ${id} not found or already completed.`);
      }
      return updatedRowCount; // Returns an array, [0] is the number of rows affected
    }

    // Instance method to format a single todo item for display
    // Takes a boolean 'showDate' which is true only for overdue items
    displayableString(showDate = false) {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let datePart = showDate ? ` ${this.dueDate}` : ""; // Only add date if showDate is true
      // Trim potential whitespace from title just in case
      return `${this.id}. ${checkbox} ${this.title.trim()}${datePart}`;
    }
  }

  // Initialize the model definition
  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false, // Title cannot be empty
        validate: {
          notNull: {
            msg: "Title cannot be null.",
          },
          notEmpty: {
            msg: "Title cannot be empty.",
          },
        },
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false, // Due date cannot be empty
        validate: {
          notNull: {
            msg: "Due date cannot be null.",
          },
        },
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Default to not completed
      },
    },
    {
      sequelize, // Pass the sequelize instance
      modelName: "Todo", // Define the model name
      // tableName: 'todos' // Optional: Explicitly set table name (Sequelize defaults to plural 'Todos')
    },
  );

  return Todo; // Return the initialized model
};
