import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { jwtPublicKEY } from '../config/index.mjs';
import { ErrorHandler } from '../utils/errorHandler.mjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const privateKeyPath = path.join(__dirname, '../keys/private_key.pem');
if (!fs.existsSync(privateKeyPath)) {
    throw new Error('Private key not found. Make sure "private.key" exists in "src/keys/"');
}
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');


export class JwtHelper {
    /**
     * Signs a JWT using RSA Private Key
     * @param {Object} payload - Data to sign
     * @param {string} expiresIn - Expiration time (e.g., '1h', '7d')
     * @returns {string} JWT Token
     */
    static signToken(payload, expiresIn = '7d') {
        return jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn,
        });
    }

    /**
     * Middleware to verify JWT and attach user info to req.user
     */
    static verifyToken(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return ErrorHandler.sendError({
                    res,
                    errorCode: 'UNAUTHORIZED',
                    statusCode: 401,
                    message: 'Access denied. No token provided',
                });
            }

            const decoded = jwt.verify(token, jwtPublicKEY, { algorithms: ['RS256'] });

            req.user = decoded;
            next();
        }
        catch (error) {
            console.log(error, 'error----------')
            return ErrorHandler.sendError({
                res,
                errorCode: 'UNAUTHORIZED',
                statusCode: 401,
                message: 'Invalid or expired token',
            });
        }
    }
}
