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
                if (change.updateDescription.updatedFields?.status) {
                    console.info('emiting user_status to client');
                    io.emit('user_status', change.documentKey._id.toString());
                }
                break;
        }
    });

    const userConnection: { [key: string]: number } = {} as {
        [key: string]: number;
    };

    io.on('connection', async socket => {
        console.info('connected to client');
        const user_id: string = socket?.handshake?.query?.user_id as string;

        if (!user_id) return;

        if (!userConnection[user_id]) (userConnection[user_id] as number) = 0;
        userConnection[user_id]++;

        if (userConnection[user_id] === 1)
            await users.updateOne(
                { user_id },
                {
                    status: 'online'
                }
            );

        socket.on('disconnect', async () => {
            console.log('disconnected from client');
            userConnection[user_id]--;

            if (userConnection[user_id] === 0)
                await users.updateOne(
                    { user_id },
                    {
                        status: 'offline'
                    }
                );
        });
    });

    server.listen(PORT, () => {
        console.info('app running on port ' + PORT);
    });
}
main();
