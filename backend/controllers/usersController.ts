import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import Express from 'express';
import Chat from '../models/Chat';
import User from '../models/User';
import Pusher = require('pusher');
dotenv.config()

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

const addUser = async (req: TypedRequestBody<{ username: string, password: string }>, res: Express.Response) => {
    if (!req.body?.username || !req.body?.password) return res.status(400).json({ message: "username or password missing" })
    const { username, password } = req.body
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: "Account with this username already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password: hashedPassword })

    if (user) {
        res.status(201).json({ message: "Account created" })
    } else {
        res.status(400).json({ message: "Invalid user data received" })
    }
}

const deleteContact = async (req: TypedRequestBody<{ username: string, password: string }>, res: Express.Response) => {
    if (!req.body?.username || !req.cookies.user_id) return res.status(400)

    const targetUsername = req.body.username
    const userId = req.cookies.user_id
    const targetUser = await User.findById(userId).lean()
    const foundUser = await User.findOne({ username: targetUsername }).lean()

    if (!foundUser || !targetUser) return res.status(400).json({ message: "No user found" })

    try {
        foundUser.contacts.filter(contact => contact !== targetUser.id)
        targetUser.contacts.filter(contact => contact !== foundUser.id)
        return res.status(201)
    } catch {
        return res.status(400).json({ message: "Error occured, try again later" })
    }
}

const getUser = async (req: TypedRequestBody<{ username: string }>, res: Express.Response) => {

    if (!req.params.id) return res.status(400)

    const { id } = req.params

    try {
        const foundUser = await User.findOne({ _id: id }, '-__v -refreshToken').lean()
        if (foundUser) {
            return res.status(200).json(foundUser)
        } else {
            return res.status(400).json({ message: "User not found" })
        }
    } catch {
        return res.status(400).json({ message: "User not found" })

    }
}

const sendContactRequest = async (req: TypedRequestBody<{ username: string }>, res: Express.Response) => {

    if (!req.params.email || !req.cookies.user_id) return res.status(400)

    const targetEmail = req.params.email
    const userId = req.cookies.user_id
    let foundUser

    try {
        foundUser = await User.findOne({ email: targetEmail }).exec()
    } catch {
        return res.status(400).json({ message: "No user found" })
    }
    if (!foundUser) {
        return res.status(400).json({ message: "No user found" })
    }

    if (userId === foundUser.id) return res.status(400).json({ message: "Cannot send request to yourself" })

    if (foundUser.contactRequests?.indexOf(userId) === -1) {
        foundUser.contactRequests.push(userId)
        await foundUser.save()
        pusher.sendToUser(foundUser.id, "contact-request", { userId });
        return res.status(201).json({ message: "Request sent" })
    } else {
        res.status(200).json({ message: "Request has already been sent" })
    }
}

const answerContactRequest = async (req: TypedRequestBody<{ id: string, response: boolean }>, res: Express.Response) => {
    if (!req.body.id || (!req.body.response && req.body.response !== false) || !req.cookies.user_id) return res.status(400).json({ message: 'Error. Please try again later' })
    const targetUserId = req.body.id
    const respondingUserId = req.cookies.user_id
    const response = req.body.response
    const userIds = [targetUserId, respondingUserId]
    try {
        const targetUser = await User.findOne({ _id: targetUserId })
        const respondingUser = await User.findOne({ _id: respondingUserId })

        if (!targetUser || !respondingUser || respondingUser.contactRequests?.indexOf(targetUserId) === -1) {
            return res.status(400).json({ message: "Error. Please try again later" })
        }
        //if user accepts the contact request

        if (response === true) {
            try {
                const newChat = await Chat.create({
                    users: userIds,
                });

                await User.updateMany({ "_id": { $in: userIds } }, { $push: { contacts: newChat.id } })

                userIds.map(userId => {
                    pusher.sendToUser(userId, "new-channel", { message: "You joined a new channel" });
                })
                respondingUser.contactRequests = respondingUser.contactRequests.filter(request => request !== targetUserId)
                await respondingUser.save()
                await targetUser.save()
                res.status(201).json({ newChatId: newChat.id })
            } catch (e) {
                console.log(e)
                res.status(400).json({ message: "An error occured. Please try again later." })
            }
        } else if (response === false) {
            respondingUser.contactRequests = respondingUser.contactRequests?.filter(request => request !== targetUserId)
            await respondingUser.save()
            return res.status(201).json({ message: false })
        } else {
            throw new Error
        }
    } catch (e: any) {
        return res.status(400).json(e.message)
    }
}

export {
    addUser, answerContactRequest, deleteContact,
    getUser,
    sendContactRequest
};
