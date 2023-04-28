import Express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt'
import { IUser } from '../../index'

interface TypedRequestBody<T> extends Express.Request {
    body: T
}

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
    if (!req.body?.username || !req.cookies.user_id) return res.status(400)

    const targetUsername = req.body.username
    const userId = req.cookies.user_id

    let foundUser = await User.findOne({ username: targetUsername }).lean()
    if (!foundUser) return res.status(400).json({ message: "No user found" })

    if (foundUser.contactRequests?.indexOf(userId) === -1) {
        foundUser.contactRequests.push(userId)
        foundUser.save()
        return res.status(201)
    } else {
        res.status(200)
    }

    //array.indexOf(newItem) === -1 ? array.push(newItem) : console.log("This item already exists");


}

const answerContactRequest = async (req: TypedRequestBody<{ username: string, response: boolean }>, res: Express.Response) => {
    if (!req.body.username || !req.body.response || !req.cookies.user_id) return res.status(400)
    const username = req.body.username
    const userId = req.cookies.user_id
    const response = req.body.response


    const targetUser = await User.findById(userId).lean()
    const foundUser = await User.findOne({ username: username }).lean()


    if (!targetUser || !foundUser || targetUser.contactRequests.indexOf(username) === -1) {
        return res.status(400)
    }
    //if user accepts the contact request
    if (response === true) {
        targetUser.contacts.push(foundUser.id)
        foundUser.contacts.push(userId)
        return res.status(201)
    } else if (response === false) {
        targetUser.contactRequests?.filter(request => request !== foundUser.id)
        return res.status(201)
    }
}

export {
    addUser,
    deleteContact,
    getUser,
    sendContactRequest,
    answerContactRequest
}