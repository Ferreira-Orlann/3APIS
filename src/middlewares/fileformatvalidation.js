import { ErrorTypes } from "../enums/errortypes.js";
import { BuildErrorJson } from "../factories/error.js";
import { magika } from "../magika.js";
import express from "express"

/**
 * @param {string[]}
 */
export function FileFormatValidation(allowed) {
    return (req, res, next) => {
        if (req.file == undefined) {
            res.status(404).json(BuildErrorJson(ErrorTypes.DATA_VALIDATION, "File isn't valid"))
            return
        }
        magika.identifyBytes(req.file.buffer).then((prediction) => {
            for (let i = 0; i < allowed.length; i++) {
                if (prediction.label == allowed[i]) {
                    next()
                    return
                }
            }
            res.status(400).json(BuildErrorJson(ErrorTypes.FILE_TYPE_NOT_ALLOWED, `File type '${prediction.label}' is not allowed`))
        }).catch((err) => {
            console.log("Error:", err)
        });
    }
}