import { Router } from "express";
import { z } from "zod"
import { BuildErrorJson } from "../factories/error.js";
import { ErrorTypes } from "../enums/errortypes.js";
import { BookTicket, ValidateTicket} from "../controllers/ticket.js"
import { JwtAuth } from "../middlewares/jwtauth.js"

export const TicketRouter = Router()

const uuidSchema = z.string().uuid();

TicketRouter.param("uuid", (req, res, next, value) => {
    uuidSchema.parseAsync(value).then((result) => {
        next()
    }).catch((err) => {
        res.status(422).json(BuildErrorJson(ErrorTypes.DATA_VALIDATION, "Invalid UUID, need UUID v4"))
    })    
})
TicketRouter.get("/:uuid", ValidateTicket)
TicketRouter.use(JwtAuth)
TicketRouter.post("/:uuid", BookTicket)