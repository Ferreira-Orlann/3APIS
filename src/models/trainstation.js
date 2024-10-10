import mongoose from "mongoose";

const TrainstationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    open_hour: {
        type: Number,
        min: 0,
        max: 24,
        required: true
    },
    close_hour: {
        type: Number,
        min: 0,
        max: 24,
        required: true
    },
    image: {
        type: mongoose.ObjectId,
        required: true
    }
})

/** @type {mongoose.Model} */
export const TrainstationModel = mongoose.model("Trainstation", TrainstationSchema)