import exp from "constants"
import { ApiRouter } from "./routers/api.js"
import express from "express"

export const app = express()

app.set('view engine', 'ejs');

app.use("/api", express.json(), ApiRouter)
app.use(express.static("public"))