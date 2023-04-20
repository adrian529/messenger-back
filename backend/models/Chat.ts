import { Schema, model } from 'mongoose';
import Message from './Message';

interface IMessage {
    userId: string;
    body: string;
    timestamp?: number;
}
// 1. Create an interface representing a document in MongoDB.
interface IChat {
    messages: IMessage[],
    users: string[]
    name?: string;
}

// 2. Create a Schema corresponding to the document interface.
const chatSchema = new Schema<IChat>({
    name: { type: String },
    users: { type: [String] },
    messages: { type: [Message.schema] },
});

// 3. Create a Model.
const Chat = model<IChat>('Chat', chatSchema);
export default Chat;