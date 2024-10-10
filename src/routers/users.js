import { Router } from "express";
import { Validate } from "../middlewares/datavalidation.js";
import { z } from "zod"
import { CreateUser, DeleteUserById, GetUserById, UpdateUserById } from "../controllers/users.js";
import { IsIdParamAValidObjectId } from "../middlewares/valididparam.js";
import { JwtAuth } from "../middlewares/jwtauth.js";

export const UserRouter = Router()

UserRouter.post("/", Validate(z.object({
    pseudo: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
}).strict()), CreateUser)
UserRouter.use(JwtAuth)
UserRouter.param("id", IsIdParamAValidObjectId)
UserRouter.get("/:id", GetUserById)
UserRouter.put("/:id", Validate(z.object({
    pseudo: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    password: z.string().min(8, "Password must be at least 8 characters long").optional(),
}).strict()), UpdateUserById)
UserRouter.delete(":/id", DeleteUserById)