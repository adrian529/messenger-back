import { Schema, model } from 'mongoose';


// 1. Create an interface representing a document in MongoDB.
interface IMessage {
    userId: string;
    body: string;
    timestamp?: number;
}
// 2. Create a Schema corresponding to the document interface.
const messageSchema = new Schema<IMessage>({
    body: { type: String, required: true },
    userId: { type: String, required: true },
    timestamp: { type: Number }
});

// 3. Create a Model.
export default messageSchema;