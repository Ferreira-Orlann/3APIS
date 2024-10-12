import { ErrorTypes } from "./enums/errortypes.js"
import { BuildErrorJson } from "./factories/error.js"
import { UserRoles } from "./enums/userroles.js"

export function HasPerm(user, role) {
    return user.role != role || user.role != UserRoles.ADMIN
}