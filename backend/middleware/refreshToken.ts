import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.idToken && !req.cookies.user_id) {
        return res.status(400)
    }
    try {
        console.log('refresh token try')
        const client_id = process.env.GOOGLE_CLIENT_ID;
        const client_secret = process.env.GOOGLE_SECRET;

        const userId = req.body.userId ? req.body.userId : req.cookies.user_id
        const foundUser = await User.findOne({ _id: userId })
        if (!foundUser) {
            return res.status(401)
        }

        const refresh_token: String = foundUser.refreshToken

        const { data } = await axios<any, any>({
            method: 'POST',
            url: 'https://oauth2.googleapis.com/token',
            params: {
                grant_type: 'refresh_token',
                client_id,
                client_secret,
                refresh_token
            }
        }).catch((err) => {
            console.log(err.message)
        })

        let accessToken = data.access_token
        let token = data.id_token

        res.cookie('access_token', accessToken, { httpOnly: true, sameSite: "none", secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.cookie('idToken', token, { httpOnly: true, sameSite: "none", secure: true, maxAge: 24 * 60 * 60 * 1000 })
        req.cookies.access_token = accessToken
        next()
    } catch (err: any) {
        console.log(err.stack)
        return res.status(400).json(err.message)
    }
}