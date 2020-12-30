import express, {Request, Response, NextFunction} from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';
import { CustomError } from './config/types';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/user';
import { MONGO_URL, PORT } from './config/appConfig';

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    }
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
    if(
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    }else {
      cb(null, false);
    }
}

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/apidoc', express.static(path.join(__dirname, 'apidoc')));

app.get('/apidoc', (req, res) => {
  res.sendFile('apidoc/index.html')
})

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(multer({storage: fileStorage, fileFilter}).single('image'));


/* Add routes */

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;    
    res.status(status).json({
        message
    })
});

mongoose
    .connect(
        MONGO_URL, { useNewUrlParser: true}
    )
    .then(result => {
        app.listen(PORT);
    })
    .catch(err => console.log(err));