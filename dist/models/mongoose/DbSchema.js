"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DbSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    application: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Application",
    },
    columns: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Column",
        },
    ],
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("DbSchema", DbSchema);
//# sourceMappingURL=DbSchema.js.map