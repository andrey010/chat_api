import express from 'express';
import { body } from 'express-validator/check';
//import { isAuth } from '../middleware/is-auth';
import { login, refreshToken, resetPassword, sendOtpCode, signUp, usersConfirmation } from '../controllers/auth';
import { sendOtp } from '../helpers/authHelper';
import { User } from '../models/user';

export const authRoutes = express.Router();

  /**
    * @api {post} /auth/signup Sign up
    * @apiVersion 1.0.0    
    * @apiGroup Auth
    * @apiDescription Create user api. After created yu0 have to confirm otp code
    *   
    * @apiParam {String} phone Phone of the User
    * @apiParam {String} fullName First and last name of the User
    * @apiParam {String} companyName Company name of the User 
    * @apiParam {String} password Password of the User 
    *
    * @apiSuccess (Success 201) {String} message User created
    * @apiSuccess (Success 201) {String} userId User's id 
    * 
    * @apiError (Error 400) {String} message Validation error or Phone is exist
    * @apiError (Error 500) {Strng} message Server error    
    */
authRoutes.post('/signup', [    
    body('phone', 'Please enter a valid phone!')        
        .matches(/^\+[0-9]{10,12}$/)
        .custom((value, {req}) => {            
            return User.findOne({phone: value})
                .then(userDoc => {
                    if(userDoc) {
                        return Promise.reject('Phone is exist')
                    }
                })
        }),
    body('password', 'Incorrect password').trim().isLength({min:5}),
    body('fullName', 'Incorrect value').isString().matches(/^[A-Z,a-z, ]{3,30}$/),
    body('companyName', 'Incorrect value').isString().matches(/^[A-Z,a-z, ]{3,50}$/)        
],
   signUp 
);

  /**
    * @api {post} /auth/login Login
    * @apiVersion 1.0.0
    * 
    * @apiGroup Auth
    * @apiDescription Users login. User have to confirmed phone with otp code
    *   
    * @apiParam {String} phone Phone of the User     
    * @apiParam {String} password Password of the User
    *
    * @apiSuccess (Success 200) {String} userId User's id
    * @apiSuccess (Success 200) {String} accessToken User's access token
    * @apiSuccess (Success 200) {String} refreshToken User's refresh token 
    * 
    * @apiError (Error 400) {String} message Validation error
    * @apiError (Error 401) {String} message Phone not confirmed
    * 
    * @apiError (Error 404) {String} message Phone not found 
    * @apiError (Error 500) {Strng} message Server error    
    */
authRoutes.post('/login', [    
    body('phone', 'Please enter a valid phone!').matches(/^\+[0-9]{10,12}$/),        
    body('password','Incorrect password').trim().isLength({min:5}),          
],
   login 
);

  /**
    * @api {post} /auth/otp/confirmation/:userId Otp confirmation
    * @apiVersion 1.0.0
    * 
    * @apiGroup Auth
    * @apiDescription Users confirmation
    *   
    * @apiParam {String} otpCode Verify code from SMS
    *
    * @apiSuccess (Success 200) {String} message Code is verified 
    *  
    * @apiError (Error 400) {String} message Validation error
    * @apiError (Error 409) {String} message Wrong code!
    * @apiError (Error 404) {String} message Phone not found 
    * @apiError (Error 500) {Strng} message Server error or Code is expired    
    */
authRoutes.post('/otp/confirmation/:userId', [   
   /*  body('phone', 'Please enter a valid phone!').matches(/^\+[0-9]{10,12}$/), */
    body('otpCode', 'Incorrect code').matches(/^\d{6,6}$/)             
],
   usersConfirmation
);

  /**
    * @api {post} /auth/password/reset/:userId Reset password
    * @apiVersion 1.0.0
    * 
    * @apiGroup Auth
    * @apiDescription Reset password. Have to confirm phone number
    *        
    * @apiParam {String} otpCode Verify code from SMS
    * @apiParam {String} password Password of the User
    * 
    * @apiSuccess (Success 200) {String} message Password changed 
    * 
    * @apiError (Error 400) {String} message Validation error
    * @apiError (Error 409) {String} message Wrong code!
    * @apiError (Error 404) {String} message Phone not found 
    * @apiError (Error 500) {Strng} message Server error or Code is expired    
    */
authRoutes.post('/password/reset/:userId', [   
    /* body('phone', 'Please enter a valid phone!').matches(/^\+[0-9]{10,12}$/), */
    body('otpCode', 'Incorrect code').matches(/^\d{6,6}$/),
    body('password','Incorrect password').trim().isLength({min:5}),             
],
   resetPassword
);

  /**
    * @api {post} /auth/otp/send Send otp code
    * @apiVersion 1.0.0
    * 
    * @apiGroup Auth    
    *   
    * @apiParam {String} phone Phone of the User   
    * @apiSuccess (Success 200) {String} message Code sent successfully 
    * @apiSuccess (Success 200) {String} userId User's id
    * 
    * @apiError (Error 400) {String} message Validation error   
    * @apiError (Error 404) {String} message Phone not found 
    * @apiError (Error 500) {Strng} message Server error    
    */
authRoutes.post('/otp/send', [
    body('phone', 'Please enter a valid phone!').matches(/^\+[0-9]{10,12}$/),
],
    sendOtpCode
);

  /**
    * @api {post} /auth/token/refresh Refresh token
    * @apiVersion 1.0.0
    * 
    * @apiGroup Auth    
    *   
    * @apiParam {String} refreshToken Refresh token of the User  
    *  
    * @apiSuccess (Success 200) {String} userId User's id
    * @apiSuccess (Success 200) {String} accessToken User's access token
    * @apiSuccess (Success 200) {String} refreshToken User's refresh token
    * 
    * @apiError (Error 400) {String} message Validation error
    * @apiError (Error 409) {String} message Invalid token 
    * @apiError (Error 500) {Strng} message Server error or token expiried  
    */
authRoutes.post('/token/refresh', refreshToken)
