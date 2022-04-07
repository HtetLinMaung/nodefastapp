import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_CONNECTOR != "sequelize"
    ? "sqlite::memory:"
    : process.env.DATABASE_URL
);

if (
  process.env.NODE_ENV === "development" &&
  process.env.DB_CONNECTOR == "sequelize"
) {
  sequelize.sync();
}

export default sequelize;
