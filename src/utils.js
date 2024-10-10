import { ErrorTypes } from "./enums/errortypes.js"
import { BuildErrorJson } from "./factories/error.js"

export function DatabaseErrorCatch(res) {
    return function(err) {
        res.status(500).json(BuildErrorJson(ErrorTypes.DATABASE, err.message))
    }
}

export function HasPerm(user, role) {
    return user.role != role || user.role != UserRoles.ADMIN
}