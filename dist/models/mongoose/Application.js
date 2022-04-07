"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Application = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    dbschemas: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "DbSchema",
        },
    ],
    apigateways: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "ApiGateway",
        },
    ],
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Application", Application);
//# sourceMappingURL=Application.js.map