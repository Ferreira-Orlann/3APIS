import { Router } from "express";
import { ValidateBody, MongooseObjectId, ValidatePagingQuery } from "../middlewares/datavalidation.js";
import { z } from "zod"
import { IsIdParamAValidObjectId } from "../middlewares/valididparam.js";
import { JwtAuth } from "../middlewares/jwtauth.js";
import { CreateTrainstation, DeleteTrainstationById, GetTrainstationById, UpdateTrainstationById, GetTrainstations } from "../controllers/trainstation.js";

export const TrainstationRouter = Router()

TrainstationRouter.get("/", ValidatePagingQuery(), GetTrainstations)
TrainstationRouter.param("id", IsIdParamAValidObjectId)
TrainstationRouter.get("/:id", GetTrainstationById)
TrainstationRouter.use(JwtAuth)
TrainstationRouter.post("/", ValidateBody(z.object({
    name: z.string().min(1, "Name is required"),
    open_hour: z.number().min(0).max(24),
    close_hour: z.number().min(0).max(24),
    image: MongooseObjectId
}).strict()), CreateTrainstation)
TrainstationRouter.put("/:id", ValidateBody(z.object({
    name: z.string().min(1, "Name is required"),
    open_hour: z.number().min(0).max(24).optional(),
    close_hour: z.number().min(0).max(24).optional(),
    image: MongooseObjectId
}).strict()), UpdateTrainstationById)
TrainstationRouter.delete("/:id", DeleteTrainstationById)