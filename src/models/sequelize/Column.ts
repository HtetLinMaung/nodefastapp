import Sequelize, { Model } from "sequelize";
import sequelize from "../../database";

class Column extends Model {
  declare name: string;
  declare datatype: string;
  declare defaultvalue: string;
  declare nullable: boolean;
}

Column.init(
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    datatype: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    defaultvalue: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    nullable: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  },
  { sequelize, tableName: "columns" }
);

export default Column;
