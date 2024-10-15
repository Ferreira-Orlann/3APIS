import { DatabaseErrorCatch } from "../factories/error";
import { TrainModel } from "../models/train";

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
export function CreateTrain(req, red) {
    const train = new TrainModel(req.body)
    train.save().then((saved) => {
        
    }).catch(DatabaseErrorCatch(res))
}