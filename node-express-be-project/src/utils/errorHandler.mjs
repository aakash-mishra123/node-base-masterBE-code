import { logger } from './logger.mjs';

/**
 * App-wide error codes for consistency
 */
class ErrorConfig {
    static errorCodes = [
        "UNKNOWN_EXCEPTION",
        "INTERNAL_SERVER_ERROR",
        "NOT_FOUND",
        "BAD_REQUEST",
        "ACCESS_TOKEN_EXPIRED",
        "REFRESH_TOKEN_EXPIRED",
        "SESSION_EXPIRED",
        "SERVER_ERROR",
        "VALIDATION_ERROR",
        "ACCESS_TOKEN_ERROR",
    ];

    static isValidErrorCode(code) {
        return this.errorCodes.includes(code);
    }
}

/**
 * Base class for all application errors
 */
export class AppError extends Error {
    constructor(
        errorCode = 'UNKNOWN_EXCEPTION',
        statusCode = 500,
        message = 'Something went wrong.',
        data = null,
        status = 'Failed'
    ) {
        if (!ErrorConfig.isValidErrorCode(errorCode)) {
            errorCode = 'UNKNOWN_EXCEPTION';
        }

        super(message);
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.data = data;
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Subclass for validation errors
 */
export class ValidationError extends AppError {
    constructor(
        message,
        data = null
    ) {
        super(
            'VALIDATION_ERROR',
            400,
            message,
            data,
            'Failed'
        );
    }
}

/**
 * Centralized error handling and utilities
 */
export class ErrorHandler {
    static sendError({ res, errorCode, statusCode, message = '', data = null, status = 'Failed' }) {
        return res.status(statusCode).json({
            success: false,
            errorCode,
            statusCode,
            message,
            data,
            status,
        });
    }

    static handleJoiError(error, res) {
        this.sendError({
            res,
            errorCode: "VALIDATION_ERROR",
            statusCode: 400,
            message: error.details[0]?.message || 'Validation failed',
        });
    }

    static appErrorHandler(err, req, res, next) {
        let statusCode = err.statusCode || 500;
        let message = err.message || 'Something went wrong';
        let errorCode = err.errorCode || 'UNKNOWN_EXCEPTION';
        let data = err.data || null;
        let status = err.status || 'Failed';

        if (err instanceof ValidationError) {
            statusCode = 400;
            errorCode = 'VALIDATION_ERROR';
        } else if (!(err instanceof AppError)) {
            console.error('Unexpected Error:', err);
            message = 'Something went wrong. Please try again later.';
        }

        logger.error({
            errorCode,
            statusCode,
            message,
            stack: err.stack || 'No stack trace',
            path: req.originalUrl,
            method: req.method,
            params: req.params,
            query: req.query,
            body: req.body,
        });

        return res.status(statusCode).json({
            success: false,
            errorCode,
            statusCode,
            message,
            data,
            status,
        });
    }

    static validateParams(schema, data) {
        const { error } = schema.validate(data);
        if (error) {
            throw new ValidationError(error.details[0].message);
        }
        return true;
    }
}
