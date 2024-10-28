import { TrainstationModel } from "../../src/models/trainstation.js";

export function InsertMockTrainstation(id, name, open_hour, close_hour, imageid) {
    let trainstation = new TrainstationModel({
        "_id": id,
        "name": name,
        "open_hour": open_hour,
        "close_hour": close_hour,
        "image": imageid
    })
    return new Promise((resolve, reject) => {
        trainstation.save().then((trainstation) => {
            resolve(trainstation)
        })
    })
}
