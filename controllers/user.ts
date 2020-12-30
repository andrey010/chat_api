import { User } from "../models/user";
import { Request, Response, NextFunction } from "express";
import { catchStatus500 } from "../helpers/throwErrors";
import { SUCCESS } from "../config/appConfig";
import { PHONE_NOT_FOUND } from "../config/errors";

export const getUserData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.params.userId;
    const user = await User.findById(userId)
    try {
        if(!user) {            
            throw PHONE_NOT_FOUND
        }
        res.status(SUCCESS).json({
            userId: user._id,
            fullName: user.fullName,
            phone: user.phone,
            companyName: user.companyName,
            role: user.role,
            image: user.image
        })
    } catch (err) {
        catchStatus500(err, next)
    }
}

//router.post("/", [checkJwt, checkRole(["ADMIN"])], UserController.newUser);