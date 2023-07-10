import Express from 'express';
import Chat from '../models/Chat';
import Pusher from "pusher"
import 'dotenv/config'

interface TypedRequestBody<T> extends Express.Request {
    body: T
}

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID as string,
    key: process.env.PUSHER_KEY as string,
    secret: process.env.PUSHER_SECRET as string,
    cluster: process.env.PUSHER_CLUSTER as string,
    useTLS: true
});

interface IMessage {
    userId: string;
    body: string;
    timestamp: number;
    chatId: String;
}


const newMessage = async (req: TypedRequestBody<{ body: string, userId: string, chatId: string }>, res: Express.Response) => {
    if (!req.body?.body || !req.body?.userId || !req.params?.chatId) return res.status(400).json({ message: "Error. Please try again later." })
    const { body, userId } = req.body
    const { chatId } = req.params

    const newMessage: IMessage = {
        userId,
        body,
        timestamp: Date.now(),
        chatId
    }

    try {
        await Chat.updateOne({ _id: chatId }, { $push: { messages: newMessage } })

        pusher.trigger(chatId, "new-message", {
            newMessage
        });

        return res.status(201).json({ message: 'message sent' })
    } catch (err) {
        let message
        if (err instanceof Error) message = err.message
        else message = String(err)
        console.log(err)
        return res.status(400).json({ message })
    }
}

export {
    newMessage,
}