import jsonwebtoken from "jsonwebtoken"
import { UserModel } from '../../src/models/user.js';

export const userid = "670aabcab6d45cfe6d008564"
export const jwtToken = jsonwebtoken.sign(userid, process.env.JWT_KEY)

export function InsertMockUser(role) {
    let user = new UserModel({
        "_id": userid,
        "email": "example2@test.com",
        "hashedPassword": "password",
        "pseudo": "Example2",
        "role": role
    })
    return new Promise((resolve, reject) => {
        user.save().then((user) => {
            resolve(user)
        })
    })
}
