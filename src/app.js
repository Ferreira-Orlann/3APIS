import express from "express"
import { UserRouter } from "./routers/users.js"
import { Login } from "./controllers/auth.js"
import { Validate } from "./middlewares/datavalidation.js";
import { z } from "zod"

export const app = express()

app.use(express.json())
app.post("/login", Validate(z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})), Login)
app.use("/users", UserRouter)