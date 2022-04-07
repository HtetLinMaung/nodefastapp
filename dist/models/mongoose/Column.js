"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Column = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    datatype: {
        type: String,
        required: true,
    },
    defaultvalue: {
        type: String,
        default: "",
    },
    nullable: {
        type: Boolean,
        default: true,
    },
    dbschema: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "DbSchema",
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Column", Column);
//# sourceMappingURL=Column.js.map