import { ApiRouter } from "./routers/api.js"
import express from "express"
import { BuildErrorJson } from "./factories/error.js";
import { ErrorTypes } from "./enums/errortypes.js";

export const app = express()

app.set('view engine', 'ejs');
app.use("/api", express.json(), ApiRouter)
app.use(express.static("public"))
app.all("*", (req, res) => {
    res.status(404).json(BuildErrorJson(ErrorTypes.DONT_EXIST, req.url))
})