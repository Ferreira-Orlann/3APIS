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

    let jwtToken

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
                return done();
            });
    })

    // it("Login", () => {
    //     supertest(app)
    //         .post("/users/login")
    //         .expect(400)
    //         .expect((res) => {
    //             res.body = "Email or Password undefined";
    //         })
    //         .end((err, res) => {
    //             if (err) return done(err);
    //             return done();
    //         });
    // })

    afterAll(() => {
        closeDatabase()
    })
})