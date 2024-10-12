import { ErrorTypes } from "../enums/errortypes.js";
import { BuildErrorJson } from "../factories/error.js";
import { FileModel } from "../models/uploads.js";
import express from "express"
import { DatabaseErrorCatch } from "../factories/error.js";
import { TrainstationModel } from "../models/trainstation.js";

const sanitize = {
    __v: false
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function CreateFile(req, res) {
    let file = new FileModel({
        mimetype: req.file.mimetype,
        filename: req.file.originalname,
        upload_time: Date.now(),
        buffer: req.file.buffer
    })
    file.save().then((result) => {
        result.buffer = undefined
        result.__v = undefined
        res.status(200).json(result)
    }).catch(BuildErrorJson(ErrorTypes.DATABASE));
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res
 */
export function GetFile(req, res) {
    FileModel.findById(req.params.id, sanitize).then((file) => {
        res.set({
            'Content-Type': file.mimetype,
            'Content-Disposition': `attachment; filename="${file.filename}"`,
            'Content-Length': file.buffer.length
        });
        res.status(200).send(file.buffer)
    }).catch(DatabaseErrorCatch(res))
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res
 */
export function DeleteFile(req, res) {
    TrainstationModel.find({image: req.params.id}, {}).then((result) => {
        if (result.length != 0) {
            res.status(400).json(BuildErrorJson(ErrorTypes.USED_ELSEWHERE))
            return
        }
        FileModel.deleteOne({id: req.params.id}).then((deleted) => {
            if (deleted.deletedCount == 0) {
                res.status(404).json(BuildErrorJson(ErrorTypes.UNKNOWN_ENTITY, "File doesn't exist"))
            }
            res.sendStatus(204)
        }).catch(DatabaseErrorCatch(res))
    }).catch(DatabaseErrorCatch(res))
}