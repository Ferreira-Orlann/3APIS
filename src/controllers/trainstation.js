import express from "express"
import { BuildErrorJson, DatabaseErrorCatch } from "../factories/error.js"
import { ErrorTypes } from "../enums/errortypes.js";
import { DocumentExist, HasPerm } from "../utils.js";
import { TrainstationModel } from "../models/trainstation.js";
import { FileModel } from "../models/file.js";

const sanitize = {
    __v: false
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function CreateTrainstation(req, res) {
    DocumentExist(FileModel, req.body.image).then((bool) => {
        if (!bool) {
            res.status(422).json(BuildErrorJson(ErrorTypes.DATA_VALIDATION, "Image doesn't exist"))
            return
        }
        const station = new TrainstationModel(req.body)
        station.save().then((saved) => {
            saved.__v = undefined
            res.status(200).json(saved)
        }).catch(DatabaseErrorCatch(res))
    }).catch(DatabaseErrorCatch(res))
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function GetTrainstationById(req, res) {
    TrainstationModel.findById(req.params.id, sanitize).then((station) => {
        if (station === null) {
            res.status(404).json(BuildErrorJson(ErrorTypes.UNKNOWN_ENTITY, "Station doesn't exist"))
            return
        }
        res.status(200).json(station)
    }).catch(DatabaseErrorCatch(res))
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function GetTrainstations(req, res) {
    const pageSize = Math.min(req.query.pageSize, process.env.PAGING_PAGE_SIZE_MAX)
    const page = Math.max(1, req.query.page) - 1
    TrainstationModel.find({}, sanitize, {
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
function ExecuteUpdateTrainstationById(req, res) {
    TrainstationModel.findByIdAndUpdate(req.params.id, res.body, {projection: sanitize, new: true}).then((station) => {
        if (station == null) {
            res.status(404).json(BuildErrorJson(ErrorTypes.UNKNOWN_ENTITY, "Station doesn't exist"))
            return
        }
        res.status(204).json(station)
    }).catch(DatabaseErrorCatch(res))
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function UpdateTrainstationById(req, res) {
    if (req.body.image) {
        DocumentExist(FileModel, req.body.image).then((bool) => {
            if (!bool) {
                res.status(422).json(BuildErrorJson(ErrorTypes.DATA_VALIDATION, "Image doesn't exist"))
                return
            }
            ExecuteUpdateTrainstationById(req, res)
        }).catch(DatabaseErrorCatch(res))
    }
    ExecuteUpdateTrainstationById(req, res)
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function DeleteTrainstationById(req, res) {
    TrainstationModel.findByIdAndDelete(req.params.id).then(() => {
        res.sendStatus(204)
    }).catch(DatabaseErrorCatch(res))
}