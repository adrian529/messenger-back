import mongoose, { Schema, model } from 'mongoose';
import Message from './Message';
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
    messages: { type: [Message] },
});

// 3. Create a Model.
const Chat = model<IChat>('Chat', chatSchema);
export default Chat;