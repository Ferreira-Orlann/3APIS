import { UserModel } from "../models/user.js";
import { hashSync } from "bcrypt";
import express from "express"
import { BuildErrorJson } from "../factories/error.js";
import { ErrorTypes } from "../enums/errortypes.js";
import mongoose from "mongoose";
import { DatabaseErrorCatch, HasPerm } from "../utils.js";
import { UserRoles } from "../enums/userroles.js";

const sanitize = {
    hashedPassword: false,
    __v: false
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function CreateUser(req, res) {
    const user = new UserModel({
        pseudo: req.body.pseudo,
        email: req.body.email,
        hashedPassword: hashSync(req.body.password, process.env.HASH_SALT)
    })
    user.save().then((saved) => {
        saved.hashedPassword = undefined
        saved.__v = undefined
        res.status(200).json(saved)
    }).catch(DatabaseErrorCatch(res))
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function GetUserById(req, res) {
    UserModel.findById(req.params.id, sanitize).then((user) => {
        if (!HasPerm(req.user, UserRoles.EMPLOYEE) && user.id != req.user.id) {
            res.status(401).json(BuildErrorJson(ErrorTypes.UNAUTHORIZED))
            return
        }
        if (user === null) {
            res.status(404).json(BuildErrorJson(ErrorTypes.UNKNOWN_ENTITY, "User doesn't exist"))
            return
        }
        res.status(200).json(user)
    }).catch(DatabaseErrorCatch(res))
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function UpdateUserById(req, res) {
    UserModel.findByIdAndUpdate(req.params.id, res.body, {projection: sanitize}).then((user) => {
        if (!HasPerm(req.user, UserRoles.ADMIN) && user.id != req.user.id) {
            res.status(401).json(BuildErrorJson(ErrorTypes.UNAUTHORIZED))
            return
        }
        if (user === null) {
            res.status(404).json(BuildErrorJson(ErrorTypes.UNKNOWN_ENTITY, "User doesn't exist"))
            return
        }
        res.status(200).json(user)
    }).catch(DatabaseErrorCatch(res))
}