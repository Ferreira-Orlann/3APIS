import mongoose from "mongoose";
import express from "express"
import { BuildErrorJson } from "../factories/error.js";
import { ErrorTypes } from "../enums/errortypes.js";

export function IsIdParamAValidObjectId(req, res, next, value) {
    if (mongoose.isObjectIdOrHexString(value)) {
        next()
        return
    }
    res.status(400).json(BuildErrorJson(ErrorTypes.MALFORMED_ID_PARAM))
}