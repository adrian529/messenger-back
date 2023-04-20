import { OAuth2Client } from 'google-auth-library';
import { Express, Request, Response, NextFunction } from 'express';
import { refreshToken } from './refreshToken';

export const verifyToken = (req: Request, res: Response, next: NextFunction, idToken?: String) => {

    if (!idToken && !req.cookies.idToken) {

        return res.status(400)
    }
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    idToken ? idToken : req.cookies.idToken

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: req.cookies.idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userid = payload!['sub'];
    }

    verify()
        .then(() => {
            res.cookie('idToken', idToken, { sameSite: "none", secure: true, maxAge: 24 * 60 * 60 * 1000 })
            next()
        })
        .catch(err => {
            refreshToken(req, res, next)
        });
}