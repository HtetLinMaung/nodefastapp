import { Schema, model, Types } from "mongoose";

interface IDbSchema {
  name: string;
  application: Types.ObjectId;
  columns: Types.ObjectId[];
}

const DbSchema = new Schema<IDbSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
    },
    columns: [
      {
        type: Schema.Types.ObjectId,
        ref: "Column",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<IDbSchema>("DbSchema", DbSchema);
