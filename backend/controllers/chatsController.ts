import Express from 'express';
import Chat from '../models/Chat';
import Pusher = require('pusher');
import User from '../models/User';
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

const getChat = async (req: TypedRequestBody<{ body: string, userId: string, chatId: string }>, res: Express.Response) => {
    const { chatId } = req.params
    if (!chatId || chatId === undefined) {
        return res.status(400).json({ message: "Error. Please try again later." })
    }

    try {
        const chat = await Chat.findOne({ _id: chatId }, '-_id -__v').lean()
        return res.status(200).json(chat)
    } catch (err: any) {
        console.log(err.stack)
        return res.status(400).json({ message: "Chat not found." })
    }
}

const getFeed = async (req: TypedRequestBody<{ messageId: string, chatId: string }>, res: Express.Response) => {
    const { chatId, messageId} = req.params
    if (!chatId || !messageId) {
        return res.status(400).json({ message: "Error. Please try again later." })
    }

    try {
        const chat = await Chat.findOne({ _id: chatId }, '-_id -__v').lean()
        return res.status(200).json(chat?.messages)
    } catch (err: any) {
        console.log(err.stack)
        return res.status(400).json({ message: "Chat not found." })
    }
}

const newChat = async (req: TypedRequestBody<{ userIds: string[], chatAdminId: string, chatName: string }>, res: Express.Response) => {
    if (!req.body.userIds) {
        return res.status(401)
    }
    try {
        const { userIds } = req.body
        const newChat = await Chat.create({
            users: userIds,
        });

        await User.updateMany({ "_id": { $in: userIds } }, { $push: { contacts: newChat.id } })

        userIds.map(userId => {
            pusher.sendToUser(userId, "new-channel", { message: "You joined a new channel" });
        })
        res.status(201).json({ newChatId: newChat.id })
    } catch {
        res.status(400).json({ message: "An error occured. Please try again later." })
    }
}

export {
    getChat,
    newChat
}