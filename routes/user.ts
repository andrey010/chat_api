import express from 'express';
import { getUserData } from '../controllers/user';
import { isAuth } from '../middleware/is-auth';

export const userRoutes = express.Router();
/**
  * @api {get} /user/getData/:userId Get users data
  * @apiVersion 1.0.0
  * 
  * @apiGroup User 
  * 
  * @apiHeader (Header) {String} Authorization Bearer token(string).   
  *   
  * @apiParam {String} userId Users id  
  *  
  * @apiSuccess (Success 200) {String} userId User's id
  * @apiSuccess (Success 200) {String} fullName User's full name
  * @apiSuccess (Success 200) {String} phone User's phone
  * @apiSuccess (Success 200) {String} companyName User's company name
  * @apiSuccess (Success 200) {Array} role User's role
  * @apiSuccess (Success 200) {String} image User's image 
  * 
  * @apiError (Error 400) {String} message Validation error
  * @apiError (Error 404) {String} message Phone not found 
  * @apiError (Error 409) {String} message Invalid token 
  * @apiError (Error 500) {Strng} message Server error or token expiried  
     */
userRoutes.get('/getData/:userId', isAuth, getUserData)