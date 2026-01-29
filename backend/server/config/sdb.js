const { Sequelize } = require("sequelize");
const path = require("path");

// Path to your existing SQLite file (assuming backend/db.sqlite3)
const sqlitePath = path.resolve(__dirname, "../../db.sqlite3");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: sqlitePath,
  logging: false,
});

module.exports = { sequelize };
