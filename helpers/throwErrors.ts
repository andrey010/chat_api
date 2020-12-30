import { validationResult } from 'express-validator/check';
import { Request, NextFunction } from 'express';
import { CustomError } from '../config/types';
import { SERVER_ERROR, VALIDATION_ERROR } from '../config/appConfig';

export const validationHelper = (req: Request) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = {
            message: errors.array()[0].msg,
            statusCode: VALIDATION_ERROR
        };
        throw error        
    }
}

export const catchStatus500 = (err: CustomError, next: NextFunction) => {
    if (!err.statusCode) {
        err.statusCode = SERVER_ERROR;
    }
    next(err);
}