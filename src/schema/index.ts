import mongoose, { Schema, Document, Model } from 'mongoose';

interface MessageQuoted {
    message_text: string;
    from_name: string;
    message_id: string;
}

interface Message extends Document {
    message_id: string;
    sender_id: string;
    receiver_id: string;
    message_text: string;
    message_timestamp: string;
    is_readed: boolean;
    read_at?: string;
    message_quoted?: MessageQuoted;
}

interface User extends Document {
    user_id: string;
    wa_number: string;
    name: string;
    created_at: string;
    update_at: string;
    role: string;
    pp: string;
    status: string;
}

const MessageQuotedSchema: Schema<MessageQuoted> = new Schema({
    message_text: { type: String, required: false },
    from_name: { type: String, required: false },
    message_id: { type: String, required: false }
});

const MessageSchema: Schema<Message> = new Schema({
    message_id: { type: String, required: true },
    sender_id: { type: String, required: true },
    receiver_id: { type: String, required: true },
    message_text: { type: String, required: true },
    message_timestamp: { type: String, required: true },
    is_readed: { type: Boolean, required: true },
    read_at: { type: String, required: false },
    message_quoted: { type: MessageQuotedSchema, required: false }
});

const UserSchema: Schema<User> = new Schema({
    user_id: { type: String, required: true },
    wa_number: { type: String, required: true },
    name: { type: String, required: true },
    created_at: { type: String, required: true },
    update_at: { type: String, required: true },
    role: { type: String, required: true },
    pp: { type: String, required: true },
    status: { type: String, required: true }
});

export const users = mongoose.model('users', UserSchema);
export const messages = mongoose.model('messages', MessageSchema);
