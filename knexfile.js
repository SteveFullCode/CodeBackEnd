const path = require("path");
const { Database } = require("sqlite");

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "src", "database", "database.db"),
    },
    useNullAsDefault: true,
  },
};
