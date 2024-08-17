import { createServer } from 'http';
import { messages } from './schema';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Server, Socket } from 'socket.io';
import 'dotenv/config';
import './connection';

const PORT: string | number = process.env.PORT || 8080;
const CLIENT_URL: string = process.env.CLIENT_URL || '';

async function main() {
    const web: Application = express();
    const server = createServer(web);
    const io: Server = new Server(server, {
        cors: {
            origin: [
                CLIENT_URL,
                'http://localhost:5173',
                'http://localhost:8159'
            ],
            methods: ['GET', 'POST']
        }
    });
    const allowedOrigins: Array<string> = [
        CLIENT_URL,
        'http://localhost:5173',
        'http://localhost:8159'
    ];

    const options: cors.CorsOptions = {
        origin: allowedOrigins
    };

    web.use(cors(options));
    web.use(express.json());

    const changeStream = messages.watch();

    changeStream.on('change', change => {
        console.info('Database Change Detected:', change);
        io.emit('data_updated', change.fullDocument);
    });

    server.listen(PORT, () => {
        console.info('app running on port ' + PORT);
    });
}
main();
