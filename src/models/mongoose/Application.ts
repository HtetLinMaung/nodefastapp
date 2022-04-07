import { Schema, model, Types } from "mongoose";

interface IApplication {
  name: string;
  dbschemas: Types.ObjectId[];
  apigateways: Types.ObjectId[];
}

const Application = new Schema<IApplication>(
  {
    name: {
      type: String,
      required: true,
    },
    dbschemas: [
      {
        type: Schema.Types.ObjectId,
        ref: "DbSchema",
      },
    ],
    apigateways: [
      {
        type: Schema.Types.ObjectId,
        ref: "ApiGateway",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<IApplication>("Application", Application);
