import express from "express";
import ApiGateway from "../models/mongoose/ApiGateway";
import Application from "../models/mongoose/Application";
import Column from "../models/mongoose/Column";
import DbSchema from "../models/mongoose/DbSchema";
import generateMongooseModel from "../utils/generate-mongoose-model";
import logger from "../utils/logger";

const router = express.Router();

const models: any = {};

function isFloat(n: number) {
  return Number(n) === n && n % 1 !== 0;
}

router.route("/:app/:table").post(async (req, res) => {
  try {
    const { app, table } = req.params;
    let application = await Application.findOne({ name: app });
    if (!application) {
      application = new Application({
        name: app,
        apigateways: [],
        dbschemas: [],
      });
      await application.save();
    }
    let apigateway = await ApiGateway.findOne({
      name: req.path,
      method: req.method,
    });
    if (!apigateway) {
      apigateway = new ApiGateway({
        name: req.path,
        method: req.method,
        application: application._id,
      });
      await apigateway.save();
      application.apigateways.push(apigateway._id);
    }
    if (!(`${table.toLowerCase()}_${application.id}` in models)) {
      let dbschema = await DbSchema.findOne({
        name: `${table.toLowerCase()}_${application.id}`,
        application: application._id,
      });
      if (!dbschema) {
        dbschema = new DbSchema({
          name: `${table.toLowerCase()}_${application.id}`,
          application: application._id,
        });
        await dbschema.save();
        application.dbschemas.push(dbschema._id);
      }

      const columns = [];
      for (const [key, value] of Object.entries(req.body) as [string, any][]) {
        let column = await Column.findOne({
          name: key,
          dbschema: dbschema._id,
        });
        if (!column) {
          let datatype = "string";
          let defaultvalue = "";
          if (typeof value == "number" && isFloat(value)) {
            datatype = "double";
            defaultvalue = "0.0";
          } else if (typeof value == "number") {
            datatype = "integer";
            defaultvalue = "0";
          } else if (typeof value == "boolean") {
            datatype = "boolean";
            defaultvalue = "0";
          }
          column = new Column({
            name: key,
            dbschema: dbschema._id,
            datatype: datatype,
            defaultvalue,
          });
          await column.save();
          dbschema.columns.push(column._id);
        }
        columns.push(column);
      }
      await dbschema.save();
      models[`${table.toLowerCase()}_${application.id}`] =
        generateMongooseModel(
          `${table.toLowerCase()}_${application.id}`,
          columns
        );
    }
    await application.save();

    const Model = models[`${table.toLowerCase()}_${application.id}`];
    const model = new Model({ ...req.body });
    const data = await model.save();

    res.status(201).json({
      code: 201,
      message: "Created",
      data,
    });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
});

export default router;
