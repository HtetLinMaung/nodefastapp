import Sequelize, { Model, HasManyAddAssociationsMixin } from "sequelize";
import sequelize from "../../database";
import ApiGateway from "./ApiGateway";
import Schema from "./Schema";

class Application extends Model {
  declare id: number;
  declare name: string;
  declare addApiGateways: HasManyAddAssociationsMixin<ApiGateway, number>;
  declare addSchemas: HasManyAddAssociationsMixin<Schema, number>;
}

Application.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "applications",
  }
);

Application.hasMany(ApiGateway);
ApiGateway.belongsTo(Application);
Application.hasMany(Schema);
Schema.belongsTo(Application);

export default Application;
