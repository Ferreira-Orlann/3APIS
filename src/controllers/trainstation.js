import { UserModel } from "../models/user.js";
import { hashSync } from "bcrypt";
import express from "express"
import { BuildErrorJson, DatabaseErrorCatch } from "../factories/error.js"
import { ErrorTypes } from "../enums/errortypes.js";
import mongoose, { Query } from "mongoose";
import { HasPerm } from "../utils.js";
import { TrainstationModel } from "../models/trainstation.js";

const sanitize = {
    __v: false
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function CreateTrainstation(req, res) {
    const station = new TrainstationModel(req.body)
    station.save().then((saved) => {
        saved.__v = undefined
        res.status(200).json(saved)
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
    console.log("limit", pageSize)
    console.log("skip", pageSize * page)
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
export function UpdateTrainstationById(req, res) {
    TrainstationModel.findByIdAndUpdate(req.params.id, res.body, {projection: sanitize}).then((station) => {
        if (!HasPerm(req.user, UserRoles.ADMIN)) {
            res.status(401).json(BuildErrorJson(ErrorTypes.UNAUTHORIZED))
            return
        }
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
export function DeleteTrainstationById(req, res) {
    TrainstationModel.findByIdAndDelete(req.params.id).then(() => {
        res.sendStatus(200)
    }).catch(DatabaseErrorCatch(res))
}