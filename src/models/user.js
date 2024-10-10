import mongoose from "mongoose";
import { UserRoles } from "../enums/userroles.js"

const UserSchema = mongoose.Schema({
    pseudo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(UserRoles),
        default: UserRoles.CLIENT
    }
})

/** @type {mongoose.Model} */
export const UserModel = mongoose.model("User", UserSchema)