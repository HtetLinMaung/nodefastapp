"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../database"));
const ApiGateway_1 = __importDefault(require("../models/sequelize/ApiGateway"));
const Application_1 = __importDefault(require("../models/sequelize/Application"));
const Column_1 = __importDefault(require("../models/sequelize/Column"));
const Schema_1 = __importDefault(require("../models/sequelize/Schema"));
const generate_sequelize_model_1 = __importDefault(require("../utils/generate-sequelize-model"));
const router = express_1.default.Router();
const models = {};
const searchColumns = {};
function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}
async function sequelizeRecursiveCreate(schemaName, application, body, fkk = null, fkv = null, parentModel = null) {
    const subBody = {};
    if (fkk) {
        body[fkk] = fkv;
    }
    if (!(schemaName in models)) {
        let schema = await Schema_1.default.findOne({
            where: {
                name: schemaName,
                ApplicationId: application.id,
            },
        });
        if (!schema) {
            schema = await Schema_1.default.create({
                name: schemaName,
            });
            application.addSchemas([schema]);
        }
        const columns = [];
        for (const [key, value] of Object.entries(body)) {
            if (Array.isArray(value)) {
                const valid = value.every((v) => typeof v == "object" && !Array.isArray(v));
                if (valid) {
                    subBody[key] = value;
                }
                delete body[key];
            }
            else if (typeof value === "object") {
            }
            else {
                let column = await Column_1.default.findOne({
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
                    }
                    else if (typeof value == "number") {
                        datatype = "integer";
                        defaultvalue = "0";
                    }
                    else if (typeof value == "boolean") {
                        datatype = "boolean";
                        defaultvalue = "0";
                    }
                    column = await Column_1.default.create({
                        name: key,
                        datatype,
                        defaultvalue,
                    });
                }
                columns.push(column);
            }
        }
        schema.addColumns(columns);
        models[schemaName] = (0, generate_sequelize_model_1.default)(schemaName, columns);
        searchColumns[schemaName] = columns
            .filter((col) => col.datatype == "string")
            .map((col) => col.name);
        await database_1.default.sync();
    }
    const Model = models[schemaName];
    const data = await Model.create({
        ...body,
    });
    for (const [key, value] of Object.entries(subBody)) {
        if (Array.isArray(value)) {
            for (const v of value) {
                await sequelizeRecursiveCreate(`${key}_${application.id}`, application, v, `${schemaName}Id`, data.id, Model);
            }
        }
    }
    return { data, Model };
}
router.route("/:app/:table").post(async (req, res) => {
    try {
        const { app, table } = req.params;
        let application = await Application_1.default.findOne({
            where: {
                name: app,
            },
        });
        if (!application) {
            application = await Application_1.default.create({
                name: app,
            });
        }
        let apigateway = await ApiGateway_1.default.findOne({
            where: {
                name: req.path,
                method: req.method,
            },
        });
        if (!apigateway) {
            apigateway = await ApiGateway_1.default.create({
                name: req.path,
                method: req.method,
            });
            application.addApiGateways([apigateway]);
        }
        const { data } = await sequelizeRecursiveCreate(`${table.toLowerCase()}_${application.id}`, application, req.body);
        res.status(201).json({
            code: 201,
            message: "Created",
            data,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            code: 500,
            message: "Internal Server Error",
        });
    }
});
exports.default = router;
//# sourceMappingURL=sequelize-crud-route.js.map