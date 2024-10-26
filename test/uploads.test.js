import 'dotenv/config'
import { UserRoles } from "../src/enums/userroles.js"
import { InsertMockUser, jwtToken } from "./utils/mockuser.js"
import { closeDatabase, connect } from "./utils/mongoose.js"
import { magika } from "../src/magika.js"
import supertest from 'supertest'
import { app } from "../src/app.js"
import { jest } from '@jest/globals';
import { FileModel } from '../src/models/file.js'
import { readFile } from 'node:fs/promises'

const filepath = "./resources/test/SUPINFO-logo.png"
export const fileid = "670aabcab6d45cfe6d008564"
const filebuffer = await readFile(filepath)

describe("Upload", () => {
    beforeAll((done) => {
        connect()
        magika.load()
        InsertMockUser(UserRoles.ADMIN).then(() => {
            done()
        })
    })
    
    it("Upload a File", (done) => {
        supertest(app)
            .post(`/api/uploads`)
            .attach("file", filepath)
            .set("Authorization", `Bearer ${jwtToken}`)
            .set("Content-Type", "multipart/form-data")
            .expect(200)
            .end((err, res) => {
                expect(res.body.mimetype).toEqual("image/png")
                expect(res.body.filename).toEqual("SUPINFO-logo.png")
                if (err) return done(err);
                return done();
            });
    })

    describe("With Mock File", () => {
        beforeAll((done) => {
            let file = new FileModel({
                _id: fileid,
                mimetype: "image/png",
                filename: "SUPINFO-logo.png",
                upload_time: new Date(Date.now()).toISOString(),
                buffer: filebuffer
            })
            file.save().then(() => {
                done()
            })
        })

        it("Get a File", (done) => {
            supertest(app)
                .get(`/api/uploads/${fileid}`)
                .expect(200)
                .end((err, res) => {
                    expect(res.body).toEqual(filebuffer)
                    if (err) return done(err);
                    return done();
                });
        })
    
        it("Delete a File", (done) => {
            supertest(app)
                .delete(`/api/uploads/${fileid}`)
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