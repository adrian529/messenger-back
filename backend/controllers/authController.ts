require('dotenv').config()
import User from '../models/User';
import axios from 'axios';
import Express, { CookieOptions } from 'express';

interface TypedRequestBody<T> extends Express.Request {
    body: T
}

const authWithGoogle = async (req: Express.Request, res: Express.Response) => {
    try {
        const { code, redirect_uri } = req.query; // code from service provider which is appended to the frontend's URL
        const client_id = process.env.GOOGLE_CLIENT_ID;
        const client_secret = process.env.GOOGLE_SECRET;
        const grant_type = 'authorization_code'; // this tells the service provider to return a code which will be used to get a token for making requests to the service provider
        const url = 'https://oauth2.googleapis.com/token'; // link to api to exchange code for token.
        const access_type = 'offline'
        const { data } = await axios({
            url,
            method: 'POST',
            params: {
                access_type,
                client_id,
                client_secret,
                redirect_uri,
                code,
                grant_type,
            }
        });

        const tokenFromGoogle = data.access_token;

        console.log(data)

        const urlForGettingUserInfo = 'https://openidconnect.googleapis.com/v1/userinfo';

        const userData = await axios({
            url: urlForGettingUserInfo,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${tokenFromGoogle}`,
            },
        });

        let userEmail = userData.data.email

        let foundUser = await User.findOne({ email: userEmail })

        if (!foundUser) {

            await User.create({
                username: userData.data.name,
                email: userEmail,
                avatar: userData.data.picture,
                serviceProvider: 'google',
                refreshToken: data.refresh_token
            })
            return foundUser = await User.findOne({ email: userEmail })
        }
        //strore users' access token in DB
        foundUser.refreshToken = data.refresh_token
        foundUser.save()
        const idToken = data.id_token
        res.cookie('idToken', idToken, { sameSite: "none", secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.cookie('access_token', tokenFromGoogle, { sameSite: "none", secure: true, maxAge: 24 * 60 * 60 * 1000 })
        const { username, contacts, avatar, email } = foundUser
        res.json({ username, contacts, avatar, email });

    } catch (err: any) {
        console.log(err.message)
        return res.json(err.message)
    }
}
export { authWithGoogle };