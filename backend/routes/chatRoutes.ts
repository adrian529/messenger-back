import express from 'express';
import { getChat, getContacts, newChat } from "../controllers/chatsController";
import { newMessage } from "../controllers/messagesController";
import { verifyToken } from "../middleware/verifyToken";

export const chatRoute = express.Router();

chatRoute.route('/new')
    .post(newChat)

chatRoute.route('/contacts')
    .get(verifyToken, getContacts)

chatRoute.route('/:chatId')
    .get(verifyToken, getChat)
    .post(verifyToken, newMessage)
