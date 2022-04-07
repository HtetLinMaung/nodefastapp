import Sequelize, {
  HasManyAddAssociationsMixin,
  HasManyCreateAssociationMixin,
  Model,
} from "sequelize";
import sequelize from "../../database";
import Column from "./Column";

class Schema extends Model {
  declare id: number;
  declare name: string;
  declare createColumn: HasManyCreateAssociationMixin<Column, "schemaId">;
  declare addColumns: HasManyAddAssociationsMixin<Column, number>;
}

Schema.init(
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
  },
  {
    sequelize,
    tableName: "schemas",
  }
);

Schema.hasMany(Column);
Column.belongsTo(Schema);

export default Schema;
