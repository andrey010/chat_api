import { CONFLICT, CREATED, JWT_CONFIG, NOT_FOUND, SERVER_ERROR, SUCCESS, UNAVTHORIZED, VALIDATION_ERROR } from "../config/appConfig";
import { CustomError } from "./types";

export const NOT_CONFIRMED_CODE: CustomError = {
    message: 'Not confirmed code.',
    statusCode: UNAVTHORIZED
};

export const WRONG_OTP: CustomError = {
    message: 'Wrong code!',
    statusCode: CONFLICT
}

export const EXPIRED_OTP: CustomError = {
    message: 'Code is expired',
    statusCode: SERVER_ERROR
}

export const WRONG_PASSWORD: CustomError = {
    message: "Wrong password!",
    statusCode: VALIDATION_ERROR,
};

export const PHONE_NOT_FOUND: CustomError = {
    message: "Phone not found",
    statusCode: NOT_FOUND,
};

export const INVALID_TOKEN: CustomError = {
    message: 'Invalid Token',
    statusCode: CONFLICT
};