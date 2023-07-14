import express from 'express';
import { authWithGoogle, getCredentials, handleLogout, pusherAuth } from '../controllers/authController';
import { verifyToken } from "../middleware/verifyToken";

export const authRoute = express.Router();

authRoute.route('/google')
    .get(authWithGoogle)
authRoute.route('/pusher')
    .post(pusherAuth)
    .get(pusherAuth)
authRoute.route('/userinfo')
    .get(verifyToken, getCredentials)
authRoute.route('/logout')
    .get(verifyToken, handleLogout)