import { OAuth2Client } from 'google-auth-library';
import { Express, Request, Response, NextFunction } from 'express';
import { refreshToken } from './refreshToken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.idToken) {

        throw new Error('no token provided');
    }
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
            next()
        })
        .catch(err => {
            console.log(err.message)
            refreshToken(req, res, next)
        });
}