import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Project API Documentation",
            version: "1.0.0",
            description: "API documentation for managing projects, modules, chapters, and sections.",
        },
        servers: [
            {
                url: "http://localhost:8000/api/v1",
                description: "Local Server",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: [
        `${__dirname}/../modules/**/swagger/*.swagger.mjs`,
        `${__dirname}/../modules/**/router/*.router.mjs`,
        `${__dirname}/../modules/**/controller/*.controller.mjs`
    ], // Scan all router and controller files and swagger files
};
