import mongoose from "mongoose";

const TrainSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    start_station: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Trainstation"
    },
    end_station: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Trainstation"
    },
    time_of_departure: {
        type: Date,
        required: true
    }
})

/** @type {mongoose.Model} */
export const TrainModel = mongoose.model("Train", TrainSchema)