import {
    addUser,
    answerContactRequest,
    deleteContact,
    getUser,
    sendContactRequest
} from "../controllers/usersController";
import { verifyToken } from "../middleware/verifyToken";

import express from 'express';

export const usersRoute = express.Router();

usersRoute.route('/new')
    .post(addUser)

usersRoute.route('/contact')
    .post(verifyToken, answerContactRequest)
    .delete(verifyToken, deleteContact)

usersRoute.route('/:id')
    .get(verifyToken, getUser)
usersRoute.route('/:email')
    .post(verifyToken, sendContactRequest)

