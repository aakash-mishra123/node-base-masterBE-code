import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import { apiLimiter, bodyParserConfig, corsOptions, expressJson, handleBase64Body, setSecurityHeaders } from './middlewares/appMiddleware.mjs';
import { accessLogStream } from './config/index.mjs';
import { ErrorHandler } from './utils/errorHandler.mjs';
import './utils/expressTypes.mjs';
import { MySQLDatabase } from './db/connection.mjs';
import { routeV1 } from './router/index.mjs';
import { swaggerOptions } from "./config/swagger.config.mjs";
const swaggerSpec = swaggerJSDoc(swaggerOptions);
export class App {
    constructor() {
        this.app = express();
        this._initializeMiddlewares();
        this._connectDatabase();
        this._initializeRoutes();
        this._initializeSwagger();
        this._initializeErrorHandling();
    }

    _initializeMiddlewares() {
        this.app.set('trust proxy', 1);

        // JSON & Base64 Middleware
        this.app.set('trust proxy', 1);
        this.app.use(expressJson);
        this.app.use(handleBase64Body);

        // Security Middleware
        this.app.use(cookieParser());
        this.app.use(helmet());
        this.app.use(setSecurityHeaders);
        this.app.disable('etag');
        this.app.disable('x-powered-by');

        // Body Parser Config
        this.app.use(bodyParser.urlencoded(bodyParserConfig.urlencoded));
        this.app.use(bodyParser.json(bodyParserConfig.json));

        // Logging Middleware
        this.app.use(morgan('combined', { stream: accessLogStream }));

        // CORS & Rate Limiting
        this.app.use(cors(corsOptions));
        this.app.options("*", cors(corsOptions));
        this.app.use(apiLimiter);
    }

    async _connectDatabase() {
        try {
            await MySQLDatabase.connect();
        }
        catch (error) {
            console.error('Database connection failed:', error);
            process.exit(1);
        }
    }

    _initializeSwagger() {
        this.app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    }

    _initializeRoutes() {
        this.app.get('/healthCheck', (req, res) => res.status(200).json({ message: "Server is running" }));
        this.app.use(routeV1);
    }

    _initializeErrorHandling() {
        // Centralized Error Handling
        this.app.use(ErrorHandler.appErrorHandler);
    }

    start(port) {
        this.server = this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        process.on('SIGINT', this._shutdown.bind(this));
        process.on('SIGTERM', this._shutdown.bind(this));
    }

    async _shutdown() {
        console.log('Shutting down server...');
        if (this.server) this.server.close();
        await MySQLDatabase.disconnect();
        process.exit(0);
    }
}
