import { ErrorTypes } from "../enums/errortypes.js";
import { BuildErrorJson } from "../factories/error.js";
import { FileModel } from "../models/file.js";
import express from "express"
import { DatabaseErrorCatch } from "../factories/error.js";
import { TrainstationModel } from "../models/trainstation.js";
import sharp from "sharp";

const sanitize = {
    __v: false
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function CreateFile(req, res) {
    sharp(req.file.buffer)
        .resize(200,200)
        .toBuffer()
        .then((buffer) => {
            let file = new FileModel({
                mimetype: req.file.mimetype,
                filename: req.file.originalname,
                upload_time: Date.now(),
                buffer: buffer
            })
            file.save().then((result) => {
                result.buffer = undefined
                result.__v = undefined
                res.status(200).json(result)
            }).catch(BuildErrorJson(ErrorTypes.DATABASE));
        }).catch((err) => {
            res.status(500).json(BuildErrorJson(ErrorTypes.IMAGE_PROCESSING_ERROR, err))
        })
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res
 */
export function GetFile(req, res) {
    FileModel.findById(req.params.id, sanitize).then((file) => {
        if (file == null) {
            res.status(404).json(BuildErrorJson(ErrorTypes.UNKNOWN_ENTITY, "File doesn't exist"))
            return
        }
        res.set({
            'Content-Type': file.mimetype,
            'Content-Disposition': `attachment;filename="${file.filename}"`,
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
            if (!deleted.acknowledged) {
                res.status(404).json(BuildErrorJson(ErrorTypes.UNKNOWN_ENTITY, "File doesn't exist"))
                return
            }
            res.sendStatus(204)
        }).catch(DatabaseErrorCatch(res))
    }).catch(DatabaseErrorCatch(res))
}