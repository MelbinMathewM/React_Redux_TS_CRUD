import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import adminRoute from './Routes/adminRoute';
import userRoute from './Routes/userRoute';

dotenv.config();

const mongo_url = process.env.MONGO_URL;
mongoose.connect(mongo_url as string)
    .then(() => console.log('ok'))
    .catch(() => console.log('not ok'))

const app = express();

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}));

const port = 3000;

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(fileUpload())

app.use('/',userRoute);
app.use('/admin',adminRoute);

app.listen(port,() => {
    console.log(`http://localhost:${port}`);
})

export default app;