import Sequelize, { Model } from "sequelize";
import sequelize from "../../database";

class ApiGateway extends Model {
  declare id: number;
  declare name: string;
  declare method: string;
  declare disabled: boolean;
  declare accessKey: string;
  //   declare applicationId: number;
}

ApiGateway.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    method: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    disabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    accessKey: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
  },
  {
    sequelize,
    tableName: "apigateways",
  }
);

export default ApiGateway;
