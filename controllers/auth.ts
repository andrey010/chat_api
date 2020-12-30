import { OtpTypes, User } from "../models/user";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { catchStatus500, validationHelper } from "../helpers/throwErrors";
import { updateTokens, sendOtp, verifyOtp } from "../helpers/authHelper";
import { Token } from "../models/token";
import { CREATED, JWT_CONFIG, NOT_FOUND, OTP_CODE, SUCCESS } from "../config/appConfig";
import { INVALID_TOKEN, NOT_CONFIRMED_CODE, PHONE_NOT_FOUND, WRONG_PASSWORD } from "../config/errors";

export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {    
    const phone = req.body.phone;
    const fullName = req.body.fullName;
    const password = req.body.password;
    const companyName = req.body.companyName;

    try {
        validationHelper(req);     
                
        const hashesPw = await bcrypt.hash(password, 12);
        const hashesOtp = await bcrypt.hash(OTP_CODE.toString(), 12);

        const otpCode: OtpTypes = {
            code: hashesOtp,
            expiresIn: Date.now() + 600000
        }  
        
        const user = new User({
            phone,
            password: hashesPw,
            otpCode,
            fullName,
            companyName,
            image: 'http://localhost:8080/images/profile.png'
        });

        await user.save();      
        await sendOtp(phone, OTP_CODE);
        const createdUser = await User.findOne({ phone})
        if(!createdUser) {
            throw NOT_FOUND
        }
        res.status(CREATED).json({
            message: "User created",
            userId: createdUser._id
        });

    } catch (err) {
        catchStatus500(err, next)
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const phone = req.body.phone;
    const password = req.body.password;

    try {
        validationHelper(req);
        
        const user = await User.findOne({ phone });        

        if (!user) {
            throw PHONE_NOT_FOUND;
        }
        if(!user.confirmed) {                  
            throw NOT_CONFIRMED_CODE
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {                
            throw WRONG_PASSWORD;
        }
        const userId = user._id.toString();
        
        const { accessToken, refreshToken} = await updateTokens(userId)
            
        res.status(SUCCESS).json({
            userId,
            accessToken,
            refreshToken
        });
         
    } catch (err) {
        catchStatus500(err, next)
    }
};

export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    const requestRefreshToken = req.body.refreshToken;
    let decodedToken
        
    try {
        decodedToken = <any>jwt.verify(requestRefreshToken, JWT_CONFIG.secret);        
                
        const token = await Token.findOne({tokenId: decodedToken.tokenId});

        if(!token || decodedToken.type !== 'refresh') {
            throw INVALID_TOKEN
        }
        
        const { accessToken, refreshToken} = await updateTokens(token.userId);

        res.status(SUCCESS).json({
            userId: token.userId,
            accessToken,
            refreshToken
        });
        
    } catch(err) {
        catchStatus500(err, next)
    }   
}

export const usersConfirmation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.params.userId;
    const otpCode = req.body.otpCode
    
    try {
        validationHelper(req);
              
        const {user, success} = await verifyOtp(userId, otpCode);
        console.log(success)
        if(success) {                
            user.confirmed = true;
            await user.save()
            res.status(SUCCESS).json({
                message: 'Code is verified'
            })
        }

    } catch(err) {
        catchStatus500(err, next)
    }
}

export const sendOtpCode = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const phone = req.body.phone;    

    try {
        validationHelper(req);       
        const user = await User.findOne({ phone });
        
        const hashesOtp = await bcrypt.hash(OTP_CODE.toString(), 12);

        const otpCode: OtpTypes = {
            code: hashesOtp,
            expiresIn: Date.now() + 600000 //10minutes
        }  

        if(!user) {
            throw PHONE_NOT_FOUND
        }                                
        
        user.otpCode = otpCode;
        await user.save();
        await sendOtp(phone, OTP_CODE);

        res.status(SUCCESS).json({
            message: 'Code sent successfully',
            userId: user._id
        })             

    } catch(err) {
        catchStatus500(err, next)
    }
}

export const resetPassword = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.params.userId;
    const otpCode = req.body.otpCode
    const password = req.body.password;    
    
    try {
        validationHelper(req); 
        const { user, success } = await verifyOtp(userId, otpCode);      
        const hashesPw = await bcrypt.hash(password, 12);

        if(success) {
            user.password = hashesPw;
            await user.save();
            res.status(SUCCESS).json({
                message: 'Password changed'
            })
        }      

    } catch(err) {
        catchStatus500(err, next)
    }
}


