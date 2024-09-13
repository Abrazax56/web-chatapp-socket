"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = exports.users = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MessageQuotedSchema = new mongoose_1.Schema({
    message_text: { type: String, required: false },
    from_name: { type: String, required: false },
    message_id: { type: String, required: false }
});
const MessageSchema = new mongoose_1.Schema({
    message_id: { type: String, required: true },
    sender_id: { type: String, required: true },
    receiver_id: { type: String, required: true },
    message_text: { type: String, required: true },
    message_timestamp: { type: String, required: true },
    is_readed: { type: Boolean, required: true },
    read_at: { type: String, required: false },
    message_quoted: { type: MessageQuotedSchema, required: false }
});
const UserSchema = new mongoose_1.Schema({
    user_id: { type: String, required: true },
    wa_number: { type: String, required: true },
    name: { type: String, required: true },
    created_at: { type: String, required: true },
    update_at: { type: String, required: true },
    role: { type: String, required: true },
    pp: { type: String, required: true },
    status: { type: String, required: true }
});
exports.users = mongoose_1.default.model('users', UserSchema);
exports.messages = mongoose_1.default.model('messages', MessageSchema);
