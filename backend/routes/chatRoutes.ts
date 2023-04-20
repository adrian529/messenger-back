import { newMessage } from "../controllers/messagesController";
import { getChat } from "../controllers/chatsController";
import express from 'express';
import { verifyToken } from '../middleware/verifyToken';
export const chatRoute = express.Router();

chatRoute.route('/:chatId')
    .get(getChat)
    .post(newMessage)
