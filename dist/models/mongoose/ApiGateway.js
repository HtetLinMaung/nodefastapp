"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ApiGateway = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    accessKey: {
        type: String,
        default: "",
    },
    application: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Application",
    },
});
exports.default = (0, mongoose_1.model)("ApiGateway", ApiGateway);
//# sourceMappingURL=ApiGateway.js.map