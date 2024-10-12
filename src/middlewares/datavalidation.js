import { z } from 'zod';
import express from "express"
import { BuildErrorJson } from '../factories/error.js';
import { ErrorTypes } from '../enums/errortypes.js';

export const MongooseObjectId = z.string().refine((val) => {
    return /^[0-9a-f]{24}$/.test(val);
}, {
    message: "Invalid ObjectId format",
});
  

/**
 * 
 * @param {z.ZodObject} zodScheme 
 * @returns {function(express.Request, express.Response, function)}
 */
export function ValidateBody(zodScheme) {
    return (req, res, next) => {
        let result = zodScheme.safeParse(req.body)
        if (result.success) {
            req.body = result.data
            next()
            return
        }
        res.json(BuildErrorJson(ErrorTypes.DATA_VALIDATION, result.error))
    }
}

/**
 * 
 * @param {z.ZodObject} zodScheme 
 * @returns {function(express.Request, express.Response, function)}
 */
export function ValidateQueryString(zodScheme) {
    return (req, res, next) => {
        let result = zodScheme.safeParse(req.query)
        console.log(req.query)
        if (result.success) {
            console.log(result)
            req.query = result.data
            next()
            return
        }
        res.json(BuildErrorJson(ErrorTypes.DATA_VALIDATION, result.error))
    }
}

/**
 *  * @returns {function(express.Request, express.Response, function)}
 */

export function ValidatePagingQuery() {
    return ValidateQueryString(z.object({
        page: z.string().regex(/^\d+(\.\d+)?$/, {message: "Must be a valid number"}).default("1"),
        pageSize: z.string().regex(/^\d+(\.\d+)?$/, {message: "Must be a valid number"}).default(process.env.PAGING_DEFAULT_PAGE_SIZE.toString())
    }).strict())
}