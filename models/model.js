import { model ,Schema } from "mongoose";

const urlSchema = new Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortId: {
        type: String,
        unique: true
    },
    createdAt:{
        type:Date,
        default: Date.now
    }
});

export const urlModel = model('url', urlSchema);
