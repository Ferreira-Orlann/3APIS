import express from "express"
import { BuildErrorJson, DatabaseErrorCatch } from "../factories/error.js"
import { ErrorTypes } from "../enums/errortypes.js"
import { UserModel } from "../models/user.js"
import { hashSync } from "bcrypt"
import jsonwebtoken from "jsonwebtoken"

const sanitize = {
    hashedPassword: false,
    __v: false
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function Login(req, res) {
    const password = req.body.password
    const email = req.body.email
    UserModel   .findOne({email: email, hashedPassword: hashSync(password, process.env.HASH_SALT)}, sanitize).then((user) => {
        if (user === null) {
            res.status(404).json(BuildErrorJson(ErrorTypes.WRONG_CREDENTIALS))
            return
        }
        res.status(200).json({ token: jsonwebtoken.sign(user._id.toString(), process.env.JWT_KEY) });
    }).catch(DatabaseErrorCatch(res))
}