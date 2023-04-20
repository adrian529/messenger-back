import { addUser } from "../controllers/usersController";
import express from 'express';

export const usersRoute = express.Router();

usersRoute.route('/new')
    .post(addUser)

