import express from "express"
import { DocumentExist } from "../utils.js"
import { TicketModel } from "../models/ticket.js"
import { DatabaseErrorCatch } from "../factories/error.js"
import { ErrorTypes } from "../enums/errortypes.js"
import { TrainModel } from "../models/train.js"

const sanitize = {
    __v: false,
    _id: false
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function BookTicket(req, res) {
    DocumentExist(TrainModel, req.body.train).then((bool) => {
        if (bool) {
            const ticket = new TicketModel(req.body)
            ticket.booktime = Date.now()
            ticket.save().then((saved) => {
                saved.__v = undefined
                saved._id = undefined
                res.status(200).json(saved)
            })
        } else {
            res.status(404).json(BuildErrorJson(ErrorTypes.DATA_VALIDATION, "Train doesn't exist"))
        }
    }).catch(DatabaseErrorCatch(res))
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function ValidateTicket(req, res) {
    TicketModel.findOne({uuid: req.params.uuid}, sanitize).then((ticket) => {
        if (ticket === null) {
            res.status(404).json(BuildErrorJson(ErrorTypes.UNKNOWN_ENTITY, "Ticket doesn't exist"))
            return
        }
        res.status(200).json(ticket)
    })
}