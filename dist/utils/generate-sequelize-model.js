"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../database"));
function generateSequelizeModel(name, columns = []) {
    const attributes = {
        id: {
            type: sequelize_1.default.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
    };
    for (const column of columns) {
        let type = sequelize_1.default.STRING;
        if (column.datatype == "double") {
            type = sequelize_1.default.DOUBLE;
        }
        else if (column.datatype == "integer") {
            type = sequelize_1.default.INTEGER;
        }
        else if (column.datatype == "boolean") {
            type = sequelize_1.default.BOOLEAN;
        }
        attributes[column.name] = {
            type,
            defaultValue: column.defaultvalue,
        };
    }
    return database_1.default.define(name, attributes);
}
exports.default = generateSequelizeModel;
//# sourceMappingURL=generate-sequelize-model.js.map