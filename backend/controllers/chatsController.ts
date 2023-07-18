import Express from 'express';
import Chat from '../models/Chat';
import User from '../models/User';
import Pusher = require('pusher');
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
        const userId = req.cookies.user_id;
        if (req.params.lastmsg === 'last-msg') {
            const chat = await Chat.findOne({ _id: chatId }, { 'messages': { $slice: -1 }, '__v': 0, '_id': 0, 'users:': 0 }).lean()
            if (!chat) return res.status(400).json({ message: "Chat not found." })
            const lastMessage = chat?.messages[0]
            const targetUserId = chat?.users.find(id => id !== userId)
            const user = await User.findOne({ _id: targetUserId }).select('username avatar').lean()
            return res.status(200).json({ lastMessage, user })
        } else {
            const chat = await Chat.findOne({ _id: chatId }, '-_id -__v').lean()
            if (!chat) return res.status(400).json({ message: "Chat not found." })

            const targetUserId = chat?.users.find(id => id !== userId)
            const user = await User.findOne({ _id: targetUserId }).select('username avatar').lean()
            return res.status(200).json({ chat, user })
        }
    } catch (err: any) {
        console.log(err.stack)
        return res.status(400).json({ message: "Chat not found." })
    }
}

const getContacts = async (req: TypedRequestBody<{ body: string, userId: string }>, res: Express.Response) => {
    const userId = req.cookies.user_id;
    const user = await User.findOne({ _id: userId }).select('contacts').lean()
    const chatIds = user?.contacts

    const contactsList = []
    try {
        const chats = await Chat.find({ _id: { $in: chatIds } }, { 'messages': { $slice: -1 }, '__v': 0, 'users:': 0 }).lean()
        for (const chat of chats) {
            try {
                const targetUserId = chat?.users.find(id => id !== userId)
                const targetUser = await User.findOne({ _id: targetUserId }).select('username avatar').lean()
                contactsList.push({ targetUser, lastMessage: chat.messages[0], chatId: chat._id })
            } catch { }
        }
        return res.status(200).json({ contactsList })
    } catch (err: any) {
        console.log(err)
        return res.status(400).json(err.message)
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
    getChat, getContacts, newChat
};
