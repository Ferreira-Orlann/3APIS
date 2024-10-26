import { trace } from "node:console"
import { ErrorTypes } from "../enums/errortypes.js"

export function BuildErrorJson(errorType, message) {
    trace(errorType, message)
    if (message === undefined) {
        return {error: errorType}
    }
    return {
        error: errorType,
        message, message
    }
}

export function DatabaseErrorCatch(res) {
    return function(err) {
        res.status(500).json(BuildErrorJson(ErrorTypes.DATABASE, err.message))
    }
}