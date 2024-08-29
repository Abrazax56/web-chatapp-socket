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
                origin: [
                    CLIENT_URL,
                    'http://localhost:5173',
                    'http://localhost:8159'
                ],
                methods: ['GET', 'POST']
            }
        });
        const allowedOrigins = [
            CLIENT_URL,
            'http://localhost:5173',
            'http://localhost:8159'
        ];
        const options = {
            origin: allowedOrigins
        };
        web.use((0, cors_1.default)(options));
        web.use(express_1.default.json());
        const changeStream = schema_1.messages.watch();
        changeStream.on('change', change => {
            console.info('Database Change Detected:', change);
            if (change.operationType === 'insert')
                io.emit('data_updated', change.fullDocument);
            if (change.operationType === 'delete')
                io.emit('data_deleted', change.documentKey._id.toString());
        });
        server.listen(PORT, () => {
            console.info('app running on port ' + PORT);
        });
    });
}
main();
