"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const sequelize_crud_route_1 = __importDefault(require("./routes/sequelize-crud-route"));
const mongoose_crud_route_1 = __importDefault(require("./routes/mongoose-crud-route"));
const PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const prefix = process.env.PREFIX || "/api";
app.use(prefix, process.env.DB_CONNECTOR != "sequelize"
    ? mongoose_crud_route_1.default
    : sequelize_crud_route_1.default);
if (process.env.DB_CONNECTOR != "sequelize") {
    mongoose_1.default
        .connect(process.env.MONGO_URL)
        .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    })
        .catch(console.log);
}
else {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}
//# sourceMappingURL=index.js.map