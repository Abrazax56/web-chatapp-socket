import { createServer } from 'http';
import { messages, users } from './schema';
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
            origin: [CLIENT_URL],
            methods: ['GET', 'POST']
        }
    });
    const allowedOrigins: Array<string> = [CLIENT_URL];

    const options: cors.CorsOptions = {
        origin: allowedOrigins
    };

    web.use(cors(options));
    web.use(express.json());

    messages.watch().on('change', change => {
        switch (change.operationType) {
            case 'insert':
                console.info('emiting data_updated to client');
                io.emit('data_updated', change.fullDocument);
                break;
            case 'delete':
                console.info('emiting data_deleted to client');
                io.emit('data_deleted', change.documentKey._id.toString());
                break;
            case 'update':
                console.info('emiting message_readed to client');
                io.emit('message_readed', change.documentKey._id.toString());
                break;
        }
    });

    users.watch().on('change', change => {
        switch (change.operationType) {
            case 'update':
                console.info('emiting user_status to client');
                io.emit('user_status', change.documentKey._id.toString());
                break;
        }
    });

    io.on('connection', socket => {
        console.info('connected to client');
        socket.on('user_online', async (user_id: string) => {
            console.info(`user with id : ${user_id} is now online`);
            const response = await users.updateOne(
                { user_id },
                {
                    status: 'online'
                }
            );
            console.log(response);
        });

        socket.on('user_offline', async (user_id: string) => {
            console.info(`user with id : ${user_id} is now offline`);
            const response = await users.updateOne(
                { user_id },
                {
                    status: 'offline'
                }
            );
            console.log(response);
        });

        socket.on('disconnect', () => console.log('disconnected from client'));
    });

    server.listen(PORT, () => {
        console.info('app running on port ' + PORT);
    });
}
main();
