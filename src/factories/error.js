export function BuildErrorJson(errorType, message) {
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