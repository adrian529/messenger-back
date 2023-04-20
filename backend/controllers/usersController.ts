import Express from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt'

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

const followUser = async (req: TypedRequestBody<{ username: string, password: string }>, res: Express.Response) => {

}
const deleteUser = async (req: TypedRequestBody<{ username: string, password: string }>, res: Express.Response) => {

}

export {
    addUser,
    followUser,
    deleteUser
}