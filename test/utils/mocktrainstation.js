import jsonwebtoken from "jsonwebtoken"
import { UserModel } from '../../src/models/user.js';
import { TrainstationModel } from "../../src/models/trainstation.js";

export function InsertTrainstationMock(id, name, open_hour, close_hour, imageid) {
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
