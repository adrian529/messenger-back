import express, { Express, Request, Response } from 'express';
import { connect } from 'mongoose'
import { usersRoute } from './routes/usersRoute';
import { chatRoute } from './routes/chatRoutes';
import { authRoute } from './routes/authRoutes';
import bodyParser from 'body-parser';
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser';

const port = process.env.PORT;

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsConfig = {
    credentials: true,
    origin: ['http://localhost:5173', 'http://192.168.100.26:5173, http:127.0.0.1:5173'],
};

app.use(cors(corsConfig))

app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, PATCH');
    res.set('Access-Controll-Allow-Origin', ['http://localhost:5173', 'http://192.168.100.26:5173, http:127.0.0.1:5173'])
    next();
});


app.use(cookieParser())

async function dbConnect() {
    let dbUrl = process.env.DATABASE_URL as string
    // 4. Connect to MongoDB
    await connect(dbUrl)

    console.log('DB connected');
}
dbConnect()

app.use('/auth', authRoute)

app.use('/user', usersRoute);

app.use('/chat', chatRoute)

app.get('/', (req: Request, res: Response) => {
    res.send('messaging app api');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

