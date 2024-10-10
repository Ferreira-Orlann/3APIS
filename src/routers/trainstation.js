import { Router } from "express";
import { Validate } from "../middlewares/datavalidation.js";
import { z } from "zod"
import { IsIdParamAValidObjectId } from "../middlewares/valididparam.js";
import { JwtAuth } from "../middlewares/jwtauth.js";
import { CreateTrainstation, DeleteTrainstationById, GetTrainstationById, UpdateTrainstationById, GetTrainstations } from "../controllers/trainstation.js";

export const TrainstationRouter = Router()

TrainstationRouter.get("/", GetTrainstations)
TrainstationRouter.param("id", IsIdParamAValidObjectId)
TrainstationRouter.get("/:id", GetTrainstationById)
TrainstationRouter.use(JwtAuth)
TrainstationRouter.post("/", Validate(z.object({
    name: z.string().min(1, "Name is required"),
    open_hour: z.number().min(0).max(24),
    close_hour: z.number().min(0).max(24),
    image: z.string()
}).strict()), CreateTrainstation)
TrainstationRouter.put("/:id", Validate(z.object({
    name: z.string().min(1, "Name is required"),
    open_hour: z.number().min(0).max(24).optional(),
    close_hour: z.number().min(0).max(24).optional(),
    image: z.string().optional()
}).strict()), UpdateTrainstationById)
TrainstationRouter.delete("/:id", DeleteTrainstationById)