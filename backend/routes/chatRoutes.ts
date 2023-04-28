import { newMessage } from "../controllers/messagesController";
import { getChat, newChat } from "../controllers/chatsController";
import { verifyToken } from "../middleware/verifyToken";
import express from 'express';

export const chatRoute = express.Router();

chatRoute.route('/new')
    .post(newChat)

chatRoute.route('/:chatId')
    .get(getChat)
    .post(verifyToken, newMessage)
