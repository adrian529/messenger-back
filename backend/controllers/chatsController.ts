import Express from 'express';
import Chat from '../models/Chat';

interface TypedRequestBody<T> extends Express.Request {
    body: T
}

const getChat = async (req: TypedRequestBody<{ body: string, userId: string, chatId: string }>, res: Express.Response) => {
    if (!req.params?.chatId) return res.status(400).json({ message: "Error. Please try again later." })

    const { chatId } = req.params

    try {
        const chat = await Chat.findOne({ _id: chatId }, '-_id -__v').lean()
        return res.status(200).json(chat)
    } catch (err) {
        return res.status(400).json({ message: "Chat not found." })
    }
}

export {
    getChat
}