import express from "express";
import rateLimit from "express-rate-limit";
import { CORS_ALLOWED_ORIGIN } from "../config/index.mjs";

export const isBase64 = (str) => {
    try {
        return Buffer.from(str, 'base64').toString('base64') === str;
    }
    catch (err) {
        return false;
    }
};

export const handleBase64Body = (req, res, next) => {
    if (req.body && typeof req.body === 'string' && isBase64(req.body)) {
        try {
            const decodedBody = Buffer.from(req.body, 'base64').toString('utf-8');
            req.body = JSON.parse(decodedBody);
        }
        catch (error) {
            console.error('Error decoding Base64 body:', error);
        }
    }
    next();
};

export const expressJson = express.json({
    limit: '5mb',
    verify: (req, res, buf, encoding) => {
        try {
            if (req.headers['content-type'] === 'application/json' ||
                req.headers['content-type'] === 'application/json; charset=utf-8') {
                const rawBody = buf.toString(encoding);

                // Check if the body is Base64 encoded
                if (isBase64(rawBody)) {
                    try {
                        const decodedBody = Buffer.from(rawBody, 'base64').toString('utf-8');
                        req.rawBody = decodedBody;
                    }
                    catch (error) {
                        req.rawBody = rawBody;
                    }
                }
                else {
                    req.rawBody = rawBody;
                }
            }
            else {
                throw new Error('Invalid content type');
            }
        } catch (err) {
            res.status(400).send({
                error: 'Invalid request payload',
            });
            throw new Error('Invalid request payload');
        }
    },
});

export const bodyParserConfig = {
    json: {
        limit: '50mb',
        parameterLimit: 100000,
        verify: (req, res, buf, encoding) => {
            if (buf.length) {
                const stringBody = buf.toString(encoding);
                if (isBase64(stringBody)) {
                    try {
                        const decodedBody = Buffer.from(stringBody, 'base64').toString('utf-8');
                        req.rawBody = decodedBody;
                    }
                    catch (error) {
                        req.rawBody = stringBody;
                    }
                }
                else {
                    req.rawBody = stringBody;
                }
            }
        }
    },
    urlencoded: {
        limit: '50mb',
        extended: true,
        parameterLimit: 100000
    }
};

const rateLimiterConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limiting each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    handler: (req, res, next) => {
        console.log('rate limit exceeded')
        return res.status(429).json({
            errorCode: 'BAD_REQUEST',
            message: 'Too many requests from this IP, please try again after 15 minutes!'
        });
    }
}
export const apiLimiter = rateLimit(rateLimiterConfig);


export const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {

        if (!origin || CORS_ALLOWED_ORIGIN.includes(origin)) {
            return callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders: 'Content-Type, Authorization, Cookie'
};

export const verifyOurOrigin = (req, res, next) => {
    const origin = req.headers.origin;
    if (CORS_ALLOWED_ORIGIN.includes(origin)) {
        next();
    }
    else {
        return res.status(403).json({ message: 'Origin not allowed' });
    }
};

export const setSecurityHeaders = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
};