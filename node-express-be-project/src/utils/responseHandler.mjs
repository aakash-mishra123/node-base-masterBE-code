export class ResponseHandler {
    /**
     * Standardized API Response
     * @param {Object} res - Express response object
     * @param {boolean} success - API success status(OPTIONAL)
     * @param {any} data - Response data
     * @param {string} message - Response message(OPTIONAL)
     * @param {number} statusCode - HTTP status code(OPTIONAL)
     */
    static sendResponse(res, success = true, data = null, message = '', statusCode = 200) {
        return res.status(statusCode).json({
            success,
            message,
            data,
        });
    }
}
