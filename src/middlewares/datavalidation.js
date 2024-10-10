import { z } from 'zod';
import express from "express"
import { BuildErrorJson } from '../factories/error.js';
import { ErrorTypes } from '../enums/errortypes.js';

/**
 * 
 * @param {z.ZodObject} zodScheme 
 * @returns {function(express.Request, express.Response, function)}
 */
export function Validate(zodScheme) {
    return (req, res, next) => {
        let result = zodScheme.safeParse(req.body)
        if (result.success) {
            next()
            return
        }
        res.json(BuildErrorJson(ErrorTypes.DATA_VALIDATION, result.error))
    }
}