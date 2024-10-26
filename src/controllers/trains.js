import { DatabaseErrorCatch } from "../factories/error.js";
import { TrainModel } from "../models/train.js";
import { TrainstationModel } from "../models/trainstation.js";
import { DocumentsExists } from "../utils.js"
import { BuildErrorJson } from "../factories/error.js";
import { ErrorTypes } from "../enums/errortypes.js";
import express from "express"

const sanitize = {
    __v: false
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function CreateTrain(req, res) {
    if (!req.body.hasOwnProperty("start_station") || !req.body.hasOwnProperty("end_station")) {
        res.status(400).json(BuildErrorJson(ErrorTypes.DATA_VALIDATION, `Need both 'start_station' and 'end_station'`))
        return
    }
    DocumentsExists(TrainModel, [req.body.start_station || undefined, req.body.end_station || undefined]).then((result) => {
        {
            let keys = Object.keys(result)
            if (keys.length < 2) {
                res.status(400).json(BuildErrorJson(ErrorTypes.DATA_VALIDATION, `Stations ${keys} doesn't exist`))
                return
            }
        }
        const train = new TrainModel(req.body)
        train.save().then((saved) => {
            saved.__v = undefined
            res.status(200).json(saved)
        })
    }).catch(DatabaseErrorCatch(res))
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function GetTrainById(req, res) {
    TrainModel.findById(req.params.id, sanitize).then((train) => {
        if (train === null) {
            res.status(404).json(BuildErrorJson(ErrorTypes.UNKNOWN_ENTITY, "Train doesn't exist"))
            return
        }
        res.status(200).json(train)
    }).catch(DatabaseErrorCatch(res))
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function GetTrains(req, res) {
    const pageSize = Math.min(req.query.pageSize, process.env.PAGING_PAGE_SIZE_MAX)
    const page = Math.max(1, req.query.page) - 1
    TrainModel.find({}, sanitize, {
        limit: pageSize,
        skip: pageSize * page
    }).then((results) => {
        res.status(200).json(results)
    }).catch(DatabaseErrorCatch(res))
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function ExecuteUpdateTrainById(req, res) {
    TrainModel.findByIdAndUpdate(req.params.id, res.body, {projection: sanitize, new: true}).then((train) => {
        if (train == null) {
            res.status(404).json(BuildErrorJson(ErrorTypes.UNKNOWN_ENTITY, "Train doesn't exist"))
            return
        }
        res.status(204).json(station)
    }).catch(DatabaseErrorCatch(res))
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function UpdateTrainById(req, res) {
    if (req.body.image) {
        DocumentsExists(TrainstationModel, [req.body.start_station, req.body.end_station]).then((results) => {
            if (req.body.start_station == undefined || results[res.body.start_station] != true) {
                res.status(400).json(BuildErrorJson(ErrorTypes.DATA_VALIDATION, "Start Station doesn't exist"))
                return
            }
            if (req.body.end_station == undefined || results[res.body.end_station] != true) {
                res.status(400).json(BuildErrorJson(ErrorTypes.DATA_VALIDATION, "End Station doesn't exist"))
                return
            }
            ExecuteUpdateTrainById(req, res)
        }).catch(DatabaseErrorCatch(res))
    }
    ExecuteUpdateTrainById(req, res)
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function DeleteTrainById(req, res) {
    TrainModel.findByIdAndDelete(req.params.id).then(() => {
        res.sendStatus(204)
    }).catch(DatabaseErrorCatch(res))
}