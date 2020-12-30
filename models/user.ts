import { Schema, Document, Model, model } from 'mongoose';

type RoleTypes = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER'

export type OtpTypes = {
  code: string,
  expiresIn: number
}

export interface IUser extends Document {  
  phone: string,
  password: string,
  otpCode: OtpTypes,
  fullName: string,
  companyName: string,
  image?: string,
  confirmed: boolean,  
  role: Array<RoleTypes>,  
}

//add methods
interface IUserDocument extends IUser {  
    
}

//add static methods
interface IUserModel extends Model<IUserDocument> {
    
}

const userSchema = new Schema({  
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  otpCode: Object,
  fullName: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    requred: true
  },
  confirmed: {
    type: Boolean,
    default: false    
  },
  role: {
    type: Array,
    default: ['SUPER_ADMIN']
  }
});

export const User = model<IUserDocument, IUserModel>('User', userSchema);







