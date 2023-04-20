import { authWithGoogle } from '../controllers/authController'
import express from 'express';

export const authRoute = express.Router();

authRoute.route('/google')
    .get(authWithGoogle)
