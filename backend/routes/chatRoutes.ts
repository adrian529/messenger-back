import { newMessage } from "../controllers/messagesController";
import { getChat, newChat } from "../controllers/chatsController";
import { verifyToken } from "../middleware/verifyToken";
import { getContacts } from "../controllers/chatsController";
import express from 'express';

export const chatRoute = express.Router();

chatRoute.route('/new')
    .post(newChat)

chatRoute.route('/contacts')
    .get(verifyToken, getContacts)

chatRoute.route('/:chatId')
    .get(verifyToken, getChat)
    .post(verifyToken, newMessage)
