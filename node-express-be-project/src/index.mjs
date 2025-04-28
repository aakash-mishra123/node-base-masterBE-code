import dotenv from 'dotenv';
dotenv.config();

import { App } from './app.mjs';

const PORT = process.env.PORT || 3000;

const server = new App();

server.start(PORT);
