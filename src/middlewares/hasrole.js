import { ErrorTypes } from "../enums/errortypes.js"
import { UserRoles } from "../enums/userroles.js"
import { BuildErrorJson } from "../factories/error.js"
import { HasPerm } from "../utils.js"

export function HasRole(role) {
    return (req, res, next) => {
        const user = req.user
        if (!user || HasPerm(req.user, role)) {
            res.status(401).json(BuildErrorJson(ErrorTypes.UNAUTHORIZED))
            return
        }
        next()
    }
}