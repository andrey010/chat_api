import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { JWT_CONFIG, ACCOUNT_SID, AUTH_TOKEN } from "../config/appConfig";
import { Token } from "../models/token";
import bcrypt from "bcryptjs";
import client from 'twilio';
import { User } from "../models/user";
import { EXPIRED_OTP, PHONE_NOT_FOUND, WRONG_OTP } from "../config/errors";

const clientMobile = client(ACCOUNT_SID, AUTH_TOKEN);

const { tokens, secret } = JWT_CONFIG;

const generateAccessToken = (userId: string) => {
    const payload = {
        type: tokens.access.type,
        userId,
    };
    const option = {
        expiresIn: tokens.access.expiresIn,
    };
    return jwt.sign(payload, secret, option);
};

export const generateRefreshToken = () => {
    const tokenId = uuidv4();
    const payload = {
        type: tokens.refresh.type,
        tokenId,
    };
    const option = {
        expiresIn: tokens.refresh.expiresIn,
    };
    const token = jwt.sign(payload, secret, option);
    return {
        tokenId,
        token,
    };
};

const replaceRefreshToken = (tokenId: string, userId: string) => {
    return Token.findOneAndDelete({ userId })
        .exec()
        .then(() => {
        Token.create({ tokenId, userId });
        });
};

export const updateTokens = (userId: string) => {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken();

    return replaceRefreshToken(refreshToken.tokenId, userId).then(() => ({
        accessToken,
        refreshToken: refreshToken.token,
    }));
};

export const sendOtp = (phone: string, code: number) => {  
        
    return clientMobile.messages
        .create({
            body: `Your verify code is ${code}`,
            from: '+13345390419',
            to: phone
        })
        .then(message => message)
        .catch(err => {
            throw err
        })            
}

export const verifyOtp = async (userId: string, otpCode: string) => {
        
    let success = false;
        
    const user = await User.findById(userId);
    if(!user) {
        throw PHONE_NOT_FOUND
    }

    const usersCode = user.otpCode;
            
    const isEqual = await bcrypt.compare(otpCode, usersCode.code);
    if(!isEqual) {
        throw WRONG_OTP
    }

    if(usersCode.expiresIn < Date.now()) {
        throw EXPIRED_OTP
    }
    success = true

    return {
        user,
        success
    }
}

/* export const startOtp = (phone_number: string, country_code: string) => {
    const body = {
        api_key: SEND_SMS_TOKEN,
        phone_number,
        via: "SMS",
        country_code,
        code_length: 4,
    };
    return fetch(
        "https://api.authy.com/protected/json/phones/verification/start",
        {
            method: "POST",
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        }
    ).then(res => res.json());
};

export const checkOtp = (phone_number: string, country_code: string, verification_code: string) => {
    const body = {
        api_key: SEND_SMS_TOKEN,
        verification_code,
        phone_number,
        country_code
    };
    return request({
        method: 'GET',
        uri: "https://api.authy.com/protected/json/phones/verification/check",
        headers: [
            {
                name: 'content-type',
                value: 'application/json'
            }
        ],
        body: JSON.stringify(body)
        
    }, function (error, response, body) {
        if (error) {
          return console.error('upload failed:', error);
        }
        //console.log('Upload successful!  Server responded with:', body);
        console.log('response', response.body)
      })  
} */
