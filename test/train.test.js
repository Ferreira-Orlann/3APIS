import 'dotenv/config'
import { UserRoles } from "../src/enums/userroles.js"
import { InsertMockUser, jwtToken } from "./utils/mockuser.js"
import { closeDatabase, connect } from "./utils/mongoose.js"
import { magika } from "../src/magika.js"
import supertest from 'supertest'
import { app } from "../src/app.js"
import { InsertMockFile } from "./utils/mockfile.js"
import { InsertMockTrainstation } from "./utils/mocktrainstation.js"
import { InsertMockTrain } from './utils/mocktrain.js'

const trainid = "670aabcab6d45cfe6d008564"
const trainstationOneId = "671d487a849651d3679a9b27"
const trainstationTwoid = "671d5284bfbcf097261ce7ce"
const filepath = "./resources/test/SUPINFO-logo.png"
let date = new Date(Date.now()).toISOString()

describe("Train", () => {
    beforeAll((done) => {
        connect()
        magika.load()
        InsertMockUser(UserRoles.ADMIN).then(() => {
            InsertMockFile(undefined, filepath, "image/png", "SUPINFO-logo.png", Date.now()).then((image) => {
                let imageid = image._id.toString()
                InsertMockTrainstation(trainstationOneId, "Trainstation One", 10, 15, imageid).then(() => {
                    InsertMockTrainstation(trainstationTwoid, "Trainstation Two", 10, 15, imageid).then(() => {
                        done()
                    })
                })
            })
        })
    })
    
    it("Create a Train", (done) => {
        supertest(app)
            .post(`/api/trains`)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                "name": "Train Test",
                "start_station": trainstationOneId,
                "end_station": trainstationTwoid,
                "time_of_departure": date
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body.name).toEqual("Train Test")
                expect(res.body.start_station).toEqual(trainstationOneId)
                expect(res.body.end_station).toEqual(trainstationTwoid)
                expect(res.body.time_of_departure).toBe(date)
                if (err) return done(err);
                return done();
            });
    })

    describe("With Mock Trainstation", () => {
        beforeAll((done) => {
            InsertMockTrain(trainid, "Train Test Two", trainstationOneId, trainstationTwoid, date).then((train) => {
                done()
            })
        })

        it("Get a Train", (done) => {
            supertest(app)
                .get(`/api/trains/${trainid}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).toEqual({
                        "_id": trainid,
                        "name": "Train Test Two",
                        "start_station": trainstationOneId,
                        "end_station": trainstationTwoid,
                        "time_of_departure": date
                    })
                    if (err) return done(err);
                    return done();
                });
        })
    
        it("Delete a Train", (done) => {
            supertest(app)
                .delete(`/api/trains/${trainid}`)
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