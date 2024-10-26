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

/**
 * 
 * @param {mongoose.Model} model 
 * @param {String[]} id
 * @returns {Promise<Object.<string,boolean>>} 
 */
export function DocumentsExists(model, ids) {
    return new Promise((resolve, reject) => {
        model.find({_id: {"$in": ids}}).then((docs) => {
            let found = {}
            for (let i = 0; i < Object.keys(docs).length; i++) {
                found[docs[i]._id] = true
            }
            resolve(found)
        }).catch(reject)
    })
}