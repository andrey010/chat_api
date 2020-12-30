import { Schema, Document, model} from 'mongoose';

export interface IToken extends Document {
  tokenId: string,
  userId: string
}

const tokenSchema = new Schema({  
    tokenId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});

export const Token = model<IToken>('Token', tokenSchema);