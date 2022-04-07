import Sequelize from "sequelize";
import sequelize from "../database";
import Column from "../models/sequelize/Column";

function generateSequelizeModel(name: string, columns: Column[] = []) {
  const attributes: any = {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  };
  for (const column of columns) {
    let type: any = Sequelize.STRING;
    if (column.datatype == "double") {
      type = Sequelize.DOUBLE;
    } else if (column.datatype == "integer") {
      type = Sequelize.INTEGER;
    } else if (column.datatype == "boolean") {
      type = Sequelize.BOOLEAN;
    }
    attributes[column.name] = {
      type,
      defaultValue: column.defaultvalue,
    };
  }
  return sequelize.define(name, attributes);
}

export default generateSequelizeModel;
