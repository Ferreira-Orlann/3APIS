import { ErrorTypes } from "./enums/errortypes.js"
import { BuildErrorJson } from "./factories/error.js"
import { UserRoles } from "./enums/userroles.js"
import mongoose from "mongoose"

export function HasPerm(user, role) {
    return user.role != role || user.role != UserRoles.ADMIN
}

/**
 * 
 * @param {mongoose.Model} model 
 * @param {String} id
 * @returns {Promise<boolean>} 
 */
export function DocumentExist(model, id) {
    return new Promise((resolve, reject) => {
        model.findById(id).then((result) => {
            if (result == null) {
                resolve(false)
                return
            }
            resolve(true)
        }).catch(reject);
    })
}