import "dotenv/config"
import { app } from "./app.js";
import mongoose from "mongoose";
import swaggerUiExpress from "swagger-ui-express";
import swaggerDoc from "../doc/swagger_doc.json" assert { type: 'json' };
import { magika } from "./magika.js";

if (process.env.doc === "true") {
    app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDoc));
}

magika.load().then(() => {
    mongoose.connect(process.env.DB_URL).then((db) => {
        console.log(`MongoDB Connected: ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`)
        app.listen(process.env.EXPRESS_PORT, (err) => {
            if (err) {
                console.log("Express Listen Error:", err)
            }
            console.log(`Express App running at http://localhost:${process.env.EXPRESS_PORT}/ !`)
        })
    }).catch((err) => {
        console.log("Mongoose Connect Error:", err)
    })
}).catch((err) => {
    console.log("Magika Error:", err)
})
