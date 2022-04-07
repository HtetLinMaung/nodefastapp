"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
function generateMongooseModel(name, columns = []) {
    const attributes = {};
    for (const column of columns) {
        let type = String;
        if (column.datatype == "double" || column.datatype == "integer") {
            type = Number;
        }
        else if (column.datatype == "boolean") {
            type = Boolean;
        }
        attributes[column.name] = {
            type,
            default: column.defaultvalue,
        };
    }
    return (0, mongoose_1.model)(name, new mongoose_1.Schema(attributes, { timestamps: true }));
}
exports.default = generateMongooseModel;
//# sourceMappingURL=generate-mongoose-model.js.map