import 'dotenv/config'
import { closeDatabase, connect } from './utils/mongoose'
import { magika } from "../src/magika.js"
import supertest from "supertest";
import { app } from "../src/app.js";

describe("Authentication & User", () => {
    beforeAll(() => {
        connect()
        magika.load()
    })

    let userid

    it("Register", (done) => {
        supertest(app)
            .post("/api/users")
            .send({
                "email": "example@test.com",
                "password": "password",
                "pseudo": "Example"
            })
            .expect(200)
            .expect((res) => {
                res.body = JSON.stringify({
                    "email": "example@test.com",
                    "password": "password",
                    "pseudo": "Example"
                })
            })
            .end((err, res) => {
                if (err) return done(err);
                userid = res.body.__id
                return done();
            });
    })

    let jwtToken

    it("Login", (done) => {
        supertest(app)
            .post("/api/login")
            .expect(200)
            .send({
                "email": "example@test.com",
                "password": "password"
            })
            .end((err, res) => {
                if (err || !res.body.token) return done(err);
                jwtToken = res.body.token
                return done();
            });
    })

    it("Update User", (done) => {
        supertest(app)
            .put(`/api/users/${userid}`)
            .expect(200)
            .send({
                "email": "example@test.fr",
            })
            .expect((res) => {
                res.body = JSON.stringify({
                    "_id": userid,
                    "email": "example@test.fr",
                    "password": "password",
                    "pseudo": "Example"
                })
            })
            .end((err, res) => {
                if (err || !res.body.token) return done(err);
                return done();
            });
    })

    afterAll(() => {
        closeDatabase()
    })
})