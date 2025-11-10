import http, { IncomingMessage, ServerResponse } from 'http';
import dotenv from 'dotenv';
import { userRouter } from './routes.js';

dotenv.config();

export const PORT = process.env.PORT || 4000;

export const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  userRouter(req, res);
})