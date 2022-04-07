import { Schema, model, Types } from "mongoose";

interface IApiGateway {
  name: string;
  method: string;
  disabled: boolean;
  accessKey: string;
  application: Types.ObjectId;
}

const ApiGateway = new Schema<IApiGateway>({
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
    type: Schema.Types.ObjectId,
    ref: "Application",
  },
});

export default model<IApiGateway>("ApiGateway", ApiGateway);
