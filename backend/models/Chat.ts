import { Schema, model } from 'mongoose';
import Message from './Message';
import mongoose from 'mongoose';
interface IMessage {
    userId: string;
    body: string;
    timestamp?: number;
}
// 1. Create an interface representing a document in MongoDB.
interface IChat extends mongoose.Document {
    messages: IMessage[]
    users: string[]
}

// 2. Create a Schema corresponding to the document interface.
const chatSchema = new Schema<IChat>({
    users: { type: [String], required: true },
    messages: { type: [Message.schema] },
});

// 3. Create a Model.
const Chat = model<IChat>('Chat', chatSchema);
export default Chat;