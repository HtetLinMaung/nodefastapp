import express from "express";
import sequelize from "../database";
import ApiGateway from "../models/sequelize/ApiGateway";
import Application from "../models/sequelize/Application";
import Column from "../models/sequelize/Column";
import Schema from "../models/sequelize/Schema";
import generateSequelizeModel from "../utils/generate-sequelize-model";

const router = express.Router();

const models: any = {};
const searchColumns: any = {};

function isFloat(n: number) {
  return Number(n) === n && n % 1 !== 0;
}

async function sequelizeRecursiveCreate(
  schemaName: string,
  application: Application,
  body: any,
  fkk: string = null,
  fkv: number | string = null,
  parentModel: any = null
) {
  const subBody: any = {};
  if (fkk) {
    body[fkk] = fkv;
  }
  if (!(schemaName in models)) {
    let schema = await Schema.findOne({
      where: {
        name: schemaName,
        ApplicationId: application.id,
      },
    });
    if (!schema) {
      schema = await Schema.create({
        name: schemaName,
      });
      application.addSchemas([schema]);
    }

    const columns = [];
    for (const [key, value] of Object.entries(body) as [string, any][]) {
      if (Array.isArray(value)) {
        const valid = value.every(
          (v) => typeof v == "object" && !Array.isArray(v)
        );
        if (valid) {
          subBody[key] = value;
        }
        delete body[key];
      } else if (typeof value === "object") {
      } else {
        let column = await Column.findOne({
          where: {
            name: key,
            SchemaId: schema.id,
          },
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
          column = await Column.create({
            name: key,
            datatype,
            defaultvalue,
          });
        }
        columns.push(column);
      }
    }

    schema.addColumns(columns);
    models[schemaName] = generateSequelizeModel(schemaName, columns);
    searchColumns[schemaName] = columns
      .filter((col) => col.datatype == "string")
      .map((col) => col.name);
    await sequelize.sync();
  }
  const Model = models[schemaName];
  const data = await Model.create({
    ...body,
  });
  for (const [key, value] of Object.entries(subBody) as [string, any]) {
    if (Array.isArray(value)) {
      for (const v of value) {
        await sequelizeRecursiveCreate(
          `${key}_${application.id}`,
          application,
          v,
          `${schemaName}Id`,
          data.id,
          Model
        );
      }
    }
  }
  return { data, Model };
}

router.route("/:app/:table").post(async (req, res) => {
  try {
    const { app, table } = req.params;
    let application = await Application.findOne({
      where: {
        name: app,
      },
    });
    if (!application) {
      application = await Application.create({
        name: app,
      });
    }
    let apigateway = await ApiGateway.findOne({
      where: {
        name: req.path,
        method: req.method,
      },
    });
    if (!apigateway) {
      apigateway = await ApiGateway.create({
        name: req.path,
        method: req.method,
      });
      application.addApiGateways([apigateway]);
    }

    // if (!(`${table.toLowerCase()}_${application.id}` in models)) {
    //   let schema = await Schema.findOne({
    //     where: {
    //       name: `${table.toLowerCase()}_${application.id}`,
    //       ApplicationId: application.id,
    //     },
    //   });
    //   if (!schema) {
    //     schema = await Schema.create({
    //       name: `${table.toLowerCase()}_${application.id}`,
    //     });
    //     application.addSchemas([schema]);
    //   }

    //   const columns = [];
    //   for (const [key, value] of Object.entries(req.body) as [string, any][]) {
    //     let column = await Column.findOne({
    //       where: {
    //         name: key,
    //         SchemaId: schema.id,
    //       },
    //     });
    //     if (!column) {
    //       let datatype = "string";
    //       let defaultvalue = "";
    //       if (typeof value == "number" && isFloat(value)) {
    //         datatype = "double";
    //         defaultvalue = "0.0";
    //       } else if (typeof value == "number") {
    //         datatype = "integer";
    //         defaultvalue = "0";
    //       } else if (typeof value == "boolean") {
    //         datatype = "boolean";
    //         defaultvalue = "0";
    //       }
    //       column = await Column.create({
    //         name: key,
    //         datatype,
    //         defaultvalue,
    //       });
    //     }
    //     columns.push(column);
    //   }
    //   schema.addColumns(columns);
    //   models[`${table.toLowerCase()}_${application.id}`] =
    //     generateSequelizeModel(
    //       `${table.toLowerCase()}_${application.id}`,
    //       columns
    //     );
    //   searchColumns[`${table.toLowerCase()}_${application.id}`] = columns
    //     .filter((col) => col.datatype == "string")
    //     .map((col) => col.name);
    //   await sequelize.sync();
    // }
    // const Model = models[`${table.toLowerCase()}_${application.id}`];
    // const data = await Model.create({
    //   ...req.body,
    // });

    const { data } = await sequelizeRecursiveCreate(
      `${table.toLowerCase()}_${application.id}`,
      application,
      req.body
    );
    res.status(201).json({
      code: 201,
      message: "Created",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      code: 500,
      message: "Internal Server Error",
    });
  }
});

export default router;
