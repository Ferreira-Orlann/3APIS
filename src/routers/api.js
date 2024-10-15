import express from "express"
import { UserRouter } from "./users.js"
import { Login } from "../controllers/auth.js"
import { ValidateBody } from "../middlewares/datavalidation.js";
import { z } from "zod"
import { TrainstationRouter } from "./trainstation.js";
import { UploadRouter } from "./uploads.js";

export const ApiRouter = express.Router()

ApiRouter.use(express.json())
ApiRouter.post("/login", ValidateBody(z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})), Login)
ApiRouter.use("/users", UserRouter)
ApiRouter.use("/trainstations", TrainstationRouter)
ApiRouter.use("/uploads", UploadRouter)