import { Express, Request, Response, NextFunction } from 'express';
import User from '../models/User';
import axios from 'axios';
import { verifyToken } from './verifyToken';

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.cookies.idToken) {
        return res.status(400)
    }
    try {
        console.log('refresh token try')
        const client_id = process.env.GOOGLE_CLIENT_ID;
        const client_secret = process.env.GOOGLE_SECRET;
        const userId = req.body.userId

        const foundUser = User.findOne({ id: userId })
        const refresh_token = process.env.TEST_REFRESH

        console.log(foundUser)

        const { data } = await axios({
            method: 'POST',
            url: 'https://oauth2.googleapis.com/token',
            params: {
                grant_type: 'refresh_token',
                client_id,
                client_secret,
                refresh_token
            }
        });

        let idToken = data.id_token
        let accessToken = data.access_token

        res.cookie('access_token', accessToken, { sameSite: "none", secure: true, maxAge: 24 * 60 * 60 * 1000 })

        verifyToken(req, res, next, idToken)
    } catch (err: any) {
        return res.status(400).json(err.message)
    }
}