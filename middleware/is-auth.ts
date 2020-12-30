import jwt from 'jsonwebtoken';
import { CustomError } from '../config/types';
import {Request, Response, NextFunction} from 'express';
import { JWT_CONFIG, SERVER_ERROR, UNAVTHORIZED } from '../config/appConfig';

const error: CustomError = {
    message: 'Not autenficated.',
    statusCode: UNAVTHORIZED
};

export const isAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {               
        throw error;
    }   

    const token = authHeader.split(' ')[1];    
    let jwtPayload;

    try {
        jwtPayload = jwt.verify(token, JWT_CONFIG.secret);
        res.locals.jwtPayload = jwtPayload;        
    } catch(err) {
        err.statusCode = SERVER_ERROR;
        throw err;
    }

    if(!jwtPayload) {        
        throw error;
    }
    
    next();
}