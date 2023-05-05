import {
    addUser,
    deleteContact,
    getUser,
    sendContactRequest,
    answerContactRequest
} from "../controllers/usersController";
import express from 'express';

export const usersRoute = express.Router();

usersRoute.route('/new')
    .post(addUser)

usersRoute.route('/contact')
    .post(answerContactRequest)
    .delete(deleteContact)

usersRoute.route('/:id')
.get(getUser)
.post(sendContactRequest)
