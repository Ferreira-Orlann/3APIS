import { Router } from "express";
import { ValidateBody, MongooseObjectId, ValidatePagingQuery } from "../middlewares/datavalidation.js";
import { z } from "zod"
import { IsIdParamAValidObjectId } from "../middlewares/valididparam.js";
import { JwtAuth } from "../middlewares/jwtauth.js";

export const TrainRouter = Router()

TrainRouter.get("/", ValidatePagingQuery(), GetTrainstations)
TrainRouter.param("id", IsIdParamAValidObjectId)
TrainRouter.get("/:id", GetTrainstationById)
TrainRouter.use(JwtAuth)
TrainRouter.use(HasRole(UserRoles.ADMIN))
TrainRouter.post("/", ValidateBody(z.object({
    name: z.string().min(1, "Name's lenght need to be greater than 1"),
    start_station: MongooseObjectId,
    end_station: MongooseObjectId,
    time_of_departure: z.date()
}).strict()), CreateTrainstation)
TrainRouter.put("/:id", ValidateBody(z.object({
    name: z.string().min(1, "Name's lenght need to be greater than 1").optional(),
    start_station: MongooseObjectId.optional(),
    end_station: MongooseObjectId.optional(),
    time_of_departure: z.date().optional()
}).strict()), UpdateTrainstationById)
TrainRouter.delete("/:id", DeleteTrainstationById)