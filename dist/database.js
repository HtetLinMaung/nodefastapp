"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(process.env.DB_CONNECTOR != "sequelize"
    ? "sqlite::memory:"
    : process.env.DATABASE_URL);
if (process.env.NODE_ENV === "development" &&
    process.env.DB_CONNECTOR == "sequelize") {
    sequelize.sync();
}
exports.default = sequelize;
//# sourceMappingURL=database.js.map