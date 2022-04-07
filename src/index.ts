import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import sequelizeCrudRoute from "./routes/sequelize-crud-route";
import mongooseCrudRoute from "./routes/mongoose-crud-route";

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

const prefix = process.env.PREFIX || "/api";

app.use(
  prefix,
  process.env.DB_CONNECTOR != "sequelize"
    ? mongooseCrudRoute
    : sequelizeCrudRoute
);

if (process.env.DB_CONNECTOR != "sequelize") {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("MongoDB connected");
      app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    })
    .catch(console.log);
} else {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}
