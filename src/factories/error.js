export function BuildErrorJson(errorType, message) {
    if (message === undefined) {
        return {error: errorType}
    }
    return {
        error: errorType,
        message, message
    }
}