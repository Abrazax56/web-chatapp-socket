"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const schema_1 = require("./schema");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
require("dotenv/config");
require("./connection");
const PORT = process.env.PORT || 8080;
const CLIENT_URL = process.env.CLIENT_URL || '';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const web = (0, express_1.default)();
        const server = (0, http_1.createServer)(web);
        const io = new socket_io_1.Server(server, {
            cors: {
                origin: [CLIENT_URL],
                methods: ['GET', 'POST']
            }
        });
        const allowedOrigins = [CLIENT_URL];
        const options = {
            origin: allowedOrigins
        };
        web.use((0, cors_1.default)(options));
        web.use(express_1.default.json());
        schema_1.messages.watch().on('change', change => {
            switch (change.operationType) {
                case 'insert':
                    console.info('emiting message inserted to client');
                    io.emit('mess.insert.on.layout', change.fullDocument);
                    io.emit('mess.insert.on.page', change.fullDocument);
                    break;
                case 'delete':
                    console.info('emiting message deleted to client');
                    io.emit('mess.delete.on.layout', change.documentKey._id.toString());
                    io.emit('mess.delete.on.page', change.documentKey._id.toString());
                    break;
                case 'update':
                    console.info('emiting message updated to client');
                    io.emit('mess.update.on.layout', change.documentKey._id.toString());
                    io.emit('mess.update.on.page', change.documentKey._id.toString());
                    break;
            }
        });
        schema_1.users.watch().on('change', change => {
            var _a;
            switch (change.operationType) {
                case 'update':
                    if ((_a = change.updateDescription.updatedFields) === null || _a === void 0 ? void 0 : _a.status) {
                        console.info('emiting user_status to client');
                        io.emit('user_status', change.documentKey._id.toString());
                    }
                    break;
            }
        });
        const userConnection = {};
        io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.info('connected to client');
            const user_id = (_b = (_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.query) === null || _b === void 0 ? void 0 : _b.user_id;
            if (!user_id)
                return;
            if (!userConnection[user_id])
                userConnection[user_id] = 0;
            userConnection[user_id]++;
            if (userConnection[user_id] === 1)
                yield schema_1.users.updateOne({ user_id }, {
                    status: 'online'
                });
            socket.on('disconnect', () => __awaiter(this, void 0, void 0, function* () {
                console.log('disconnected from client');
                userConnection[user_id]--;
                if (userConnection[user_id] === 0)
                    yield schema_1.users.updateOne({ user_id }, {
                        status: 'offline'
                    });
            }));
        }));
        server.listen(PORT, () => {
            console.info('app running on port ' + PORT);
        });
    });
}
main();
