import { ApiRouter } from "./routers/api.js"
import express from "express"
import { BuildErrorJson } from "./factories/error.js";
import { ErrorTypes } from "./enums/errortypes.js";
import swaggerUiExpress from "swagger-ui-express";
import swaggerDoc from "../doc/swagger_doc.json" assert { type: 'json' };

export const app = express()

app.set('view engine', 'ejs');
app.use("/api", express.json(), ApiRouter)
app.use(express.static("public"))
if (process.env.doc === "true") {
    app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDoc));
}
app.all("*", (req, res) => {
    res.status(404).json(BuildErrorJson(ErrorTypes.DONT_EXIST, req.url))
})