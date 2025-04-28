import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MySQL configuration
export const MYSQL_USERNAME = process.env.MYSQL_USERNAME;
export const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
export const MYSQL_DATABASE_NAME = process.env.MYSQL_DATABASE_NAME;

// CORS configuration
export const PROD_CORS_ALLOWED_ORIGIN = ['https://demo15.ciadmin.in', 'https://demo14.ciadmin.in', 'http://localhost:5173'];
export const DEV_CORS_ALLOWED_ORIGIN = ['https://demo15.ciadmin.in', 'https://demo14.ciadmin.in', 'http://localhost:3000', 'http://localhost:5173'];
export const CORS_ALLOWED_ORIGIN = process.env.NODE_ENV === 'PRODUCTION'
    ? PROD_CORS_ALLOWED_ORIGIN
    : DEV_CORS_ALLOWED_ORIGIN;


//using .env for variable names won't allow path.join methods. 

const logsDir = path.join(__dirname, '../', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

export const accessLogStream = fs.createWriteStream(path.join(logsDir, 'api_log.log'), { flags: 'a' });

const keysDir = path.join(__dirname, '../', 'keys');
if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
}

const publicKeyPath = path.join(keysDir, 'public_key.pem');
if (!fs.existsSync(publicKeyPath)) {
    fs.writeFileSync(publicKeyPath, 'YOUR_PUBLIC_KEY_HERE');
}
export const jwtPublicKEY = fs.readFileSync(publicKeyPath, 'utf8');


export const tempStorageDir = path.join(__dirname, '../', 'tempStorage');
if (!fs.existsSync(tempStorageDir)) {
    fs.mkdirSync(tempStorageDir, { recursive: true });
}
