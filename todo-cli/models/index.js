"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
// Determine the environment (default to 'development')
const env = process.env.NODE_ENV || "development";
// Load the config file
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
// Create the Sequelize instance based on config
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

// Load all model files from the current directory
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && // Not hidden
      file !== basename && // Not this index file itself
      file.slice(-3) === ".js" && // Is a JavaScript file
      file.indexOf(".test.js") === -1 // Not a test file
    );
  })
  .forEach((file) => {
    // Import the model definition function
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    // Store the model in the db object
    db[model.name] = model;
  });

// Set up associations if defined
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the sequelize instance and the Sequelize library
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; // Export the db object containing models and connection
