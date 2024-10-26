import 'dotenv/config'
import { UserRoles } from "../src/enums/userroles.js"
import { InsertMockUser, jwtToken } from "./utils/mockuser.js"
import { closeDatabase, connect } from "./utils/mongoose.js"
import { magika } from "../src/magika.js"
import supertest from 'supertest'
import { app } from "../src/app.js"
import { InsertMockFile } from "./utils/mockfile.js"
import { InsertTrainstationMock } from "./utils/mocktrainstation.js"

export const trainstartionid = "670aabcab6d45cfe6d008564"
const filepath = "./resources/test/SUPINFO-logo.png"
let imageid

describe("Trainstation", () => {
    beforeAll((done) => {
        connect()
        magika.load()
        InsertMockUser(UserRoles.ADMIN).then(() => {
            InsertMockFile(undefined, filepath, "image/png", "SUPINFO-logo.png", Date.now()).then((image) => {
                imageid = image._id.toString()
                done()
            })
        })
    })
    
    it("Create a Trainstatin", (done) => {
        supertest(app)
            .post(`/api/trainstations`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                "name": "Gare de Tours",
                "open_hour": 8,
                "close_hour": 21,
                "image": imageid
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body.name).toEqual("Gare de Tours")
                expect(res.body.open_hour).toEqual(8)
                expect(res.body.close_hour).toEqual(21)
                expect(res.body.image).toEqual(imageid)
                if (err) return done(err);
                return done();
            });
    })

    describe("With Mock Trainstation", () => {
        beforeAll((done) => {
            InsertTrainstationMock(trainstartionid, "Gare de Test", 10, 15, imageid).then((trainstation) => {
                done()
            })
        })

        it("Get Trainstation", (done) => {
            supertest(app)
                .get(`/api/trainstations/${trainstartionid}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).toEqual({
                        "_id": trainstartionid,
                        "name": "Gare de Test",
                        "open_hour": 10,
                        "close_hour": 15,
                        "image": imageid
                    })
                    if (err) return done(err);
                    return done();
                });
        })
    
        it("Delete a Trainstation", (done) => {
            supertest(app)
                .delete(`/api/trainstations/${trainstartionid}`)
                .set("Authorization", `Bearer ${jwtToken}`)
                .expect(204)
                .end((err, res) => {
                    if (err) return done(err);
                    return done();
                });
        })
    })

    afterAll(() => {
        closeDatabase()
    })
})