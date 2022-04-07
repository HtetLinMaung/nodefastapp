import { Schema, model } from "mongoose";
import { IColumn } from "../models/mongoose/Column";

function generateMongooseModel(name: string, columns: IColumn[] = []) {
  const attributes: any = {};
  for (const column of columns) {
    let type: any = String;
    if (column.datatype == "double" || column.datatype == "integer") {
      type = Number;
    } else if (column.datatype == "boolean") {
      type = Boolean;
    }
    attributes[column.name] = {
      type,
      default: column.defaultvalue,
    };
  }
  return model<any>(name, new Schema(attributes, { timestamps: true }));
}

export default generateMongooseModel;
