"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ApiGateway_1 = __importDefault(require("../models/mongoose/ApiGateway"));
const Application_1 = __importDefault(require("../models/mongoose/Application"));
const Column_1 = __importDefault(require("../models/mongoose/Column"));
const DbSchema_1 = __importDefault(require("../models/mongoose/DbSchema"));
const generate_mongoose_model_1 = __importDefault(require("../utils/generate-mongoose-model"));
const router = express_1.default.Router();
const models = {};
function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}
router.route("/:app/:table").post(async (req, res) => {
    try {
        const { app, table } = req.params;
        let application = await Application_1.default.findOne({ name: app });
        if (!application) {
            application = new Application_1.default({
                name: app,
                apigateways: [],
                dbschemas: [],
            });
            await application.save();
        }
        let apigateway = await ApiGateway_1.default.findOne({
            name: req.path,
            method: req.method,
        });
        if (!apigateway) {
            apigateway = new ApiGateway_1.default({
                name: req.path,
                method: req.method,
                application: application._id,
            });
            await apigateway.save();
            application.apigateways.push(apigateway._id);
        }
        if (!(`${table.toLowerCase()}_${application.id}` in models)) {
            let dbschema = await DbSchema_1.default.findOne({
                name: `${table.toLowerCase()}_${application.id}`,
                application: application._id,
            });
            if (!dbschema) {
                dbschema = new DbSchema_1.default({
                    name: `${table.toLowerCase()}_${application.id}`,
                    application: application._id,
                });
                await dbschema.save();
                application.dbschemas.push(dbschema._id);
            }
            const columns = [];
            for (const [key, value] of Object.entries(req.body)) {
                let column = await Column_1.default.findOne({
                    name: key,
                    dbschema: dbschema._id,
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
                    column = new Column_1.default({
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
                (0, generate_mongoose_model_1.default)(`${table.toLowerCase()}_${application.id}`, columns);
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
//# sourceMappingURL=mongoose-crud-route.js.map