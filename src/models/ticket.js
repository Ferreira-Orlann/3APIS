import mongoose from "mongoose";
import { randomUUID } from "crypto"

const TicketSchema = mongoose.Schema({
    train: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Train"
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    uuid: {
        type: mongoose.Types.UUID,
        default: () => randomUUID()
    },
    booktime: {
        type: Date,
        required: true
    }
})

/** @type {mongoose.Model} */
export const TicketModel = mongoose.model("Ticket", FileSchema)