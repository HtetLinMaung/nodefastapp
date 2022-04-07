import { Schema, model, Types } from "mongoose";

export interface IColumn {
  name: string;
  datatype: string;
  defaultvalue: string;
  nullable: boolean;
  dbschema: Types.ObjectId;
}

const Column = new Schema<IColumn>(
  {
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
      type: Schema.Types.ObjectId,
      ref: "DbSchema",
    },
  },
  {
    timestamps: true,
  }
);

export default model<IColumn>("Column", Column);
