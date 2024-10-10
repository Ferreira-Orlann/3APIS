import { ErrorTypes } from "../enums/errortypes.js";
import { BuildErrorJson } from "../factories/error.js";
import { UserModel } from "../models/user.js";
import express from "express"
import jsonwebtoken from "jsonwebtoken"

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function JwtAuth(req, res, next) {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken.verify(token, process.env.JWT_KEY, (err, userId) => {
            if (err) {
                res.status(400).json(BuildErrorJson(ErrorTypes.JWT_ERROR, err.message));
                return 
            }
            UserModel.findOne({_id:userId}).then((user) => {
                req.user = user
                if (user === null) {
                    res.status(401).json(BuildErrorJson(ErrorTypes.UNKNOWN_ENTITY, "User doesn't exist"));
                    return
                }
                next();
            }).catch(() => {
                res.sendStatus(401);
            })
        });
      } else {
        res.status(400).json(BuildErrorJson(ErrorTypes.MISSING_AUTH_HEADER));
      }
}