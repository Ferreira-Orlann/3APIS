import mongoose from "mongoose";
import { UserRoles } from "../enums/userroles.js"
import { buffer } from "stream/consumers";

const FileSchema = mongoose.Schema({
    mimetype: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    upload_time: {
        type: Date,
        required: true
    },
    buffer: {
        type: Buffer,
        required: true
    }
})

/** @type {mongoose.Model} */
export const FileModel = mongoose.model("File", FileSchema)