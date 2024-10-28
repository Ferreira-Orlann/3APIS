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
import { TicketModel } from '../src/models/ticket.js'

const trainid = "670aabcab6d45cfe6d008564"
const trainstationOneId = "671d487a849651d3679a9b27"
const trainstationTwoid = "671d5284bfbcf097261ce7ce"
const filepath = "./resources/test/SUPINFO-logo.png"
const userid = "5a97f9c91c807bb9c6eb5fb4"
const ticketuuid = "f7aace13-2781-460d-adbe-507c7a8fd0a7"
const ticketid = "5a97f9c91c807bb9c6eb5fb4"
let date = new Date(Date.now()).toISOString()

describe("Ticket", () => {
    beforeAll((done) => {
        connect()
        magika.load()
        InsertMockUser(UserRoles.ADMIN).then(() => {
            InsertMockFile(userid, filepath, "image/png", "SUPINFO-logo.png", Date.now()).then((image) => {
                let imageid = image._id.toString()
                InsertMockTrainstation(trainstationOneId, "Trainstation One", 10, 15, imageid).then(() => {
                    InsertMockTrainstation(trainstationTwoid, "Trainstation Two", 10, 15, imageid).then(() => {
                        InsertMockTrain(trainid, "Test Train", trainstationOneId, trainstationTwoid, date).then((train) => {
                            done()
                        })
                    })
                })
            })
        })
    })
    
    it("Book a Ticket", (done) => {
        supertest(app)
            .post(`/api/tickets`)
            .send({
                "train": trainid,
                "user": userid
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body.train).toEqual(trainid)
                expect(res.body.user).toEqual(userid)
                if (err) return done(err);
                return done();
            });
    })

    afterAll(() => {
        closeDatabase()
    })
})