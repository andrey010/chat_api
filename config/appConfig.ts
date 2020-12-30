import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/chat_api';

export const SUCCESS = 200;
export const CREATED = 201;

export const VALIDATION_ERROR = 400;
export const UNAVTHORIZED = 401;
export const PERMISSION_DENIDED = 403;
export const NOT_FOUND = 404;
export const CONFLICT = 409;

export const SERVER_ERROR = 500;

export const ACCOUNT_SID = process.env.ACCOUNT_SID
export const AUTH_TOKEN = process.env.AUTH_TOKEN

export const OTP_CODE = Math.floor(100000 + Math.random() * 900000);

const SECRET_KEY = process.env.SECRET_KEY || '970648fea796c00e5b4b8c9619e098e09f68d7fee3f5a859da7590e428fa0360'

export const JWT_CONFIG = {
    secret: SECRET_KEY,
    tokens: {
        access: {
            type: 'access',
            expiresIn: '1h'
        },
        refresh: {
            type: 'refresh',
            expiresIn: '2h'
        }
    }
}
