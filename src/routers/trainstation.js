import { Router } from "express";
import { ValidateBody, MongooseObjectId, ValidatePagingQuery, ValidateSortingQuery } from "../middlewares/datavalidation.js";
import { z } from "zod"
import { IsIdParamAValidObjectId } from "../middlewares/valididparam.js";
import { JwtAuth } from "../middlewares/jwtauth.js";
import { CreateTrainstation, DeleteTrainstationById, GetTrainstationById, UpdateTrainstationById, GetTrainstations } from "../controllers/trainstation.js";
import { HasRole } from "../middlewares/hasrole.js";
import { UserRoles } from "../enums/userroles.js";

export const TrainstationRouter = Router()

TrainstationRouter.get("/", ValidatePagingQuery(false), ValidateSortingQuery(["name", "open_hour", "close_hour"]), GetTrainstations)
TrainstationRouter.param("id", IsIdParamAValidObjectId)
TrainstationRouter.get("/:id", GetTrainstationById)
TrainstationRouter.use(JwtAuth)
TrainstationRouter.use(HasRole(UserRoles.ADMIN))
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
    image: MongooseObjectId.optional()
}).strict()), UpdateTrainstationById)
TrainstationRouter.delete("/:id", DeleteTrainstationById)