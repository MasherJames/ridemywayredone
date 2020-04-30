"use strict";

import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import configs from "../../config/config";

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = configs[env];
const db = {};

// Create sequelize instance
const sequelize = new Sequelize(config.url);

// Assign db obj with all models name and path
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

// Make all models associates
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
