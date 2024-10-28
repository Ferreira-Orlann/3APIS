import { TrainModel } from "../../src/models/train.js";

export function InsertMockTrain(id, name, start_station, end_station, time_of_departure) {
    let train = new TrainModel({
        "_id": id,
        "name": name,
        "start_station": start_station,
        "end_station": end_station,
        "time_of_departure": time_of_departure
    })
    return new Promise((resolve, reject) => {
        train.save().then((train) => {
            resolve(train)
        })
    })
}
