import 'dotenv/config'
import { closeDatabase, connect } from './utils/mongoose'
import { magika } from "../src/magika.js"
import supertest from "supertest";
import { app } from "../src/app.js";
import jsonwebtoken from "jsonwebtoken"
import { UserModel } from '../src/models/user.js';

describe("Authentication & User", () => {
    beforeAll(() => {
        connect()
        magika.load()
    })

    it("Register", (done) => {
        supertest(app)
            .post("/api/users")
            .send({
                "email": "example@test.com",
                "password": "password",
                "pseudo": "Example"
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body.email).toBe("example@test.com")
                expect(res.body.pseudo).toBe("Example")
                expect(res.body.role).toBe("client")
                if (err) return done(err);
                return done();
            });
    })

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
                return done();
            });
    })

    describe("Loged Test", () => {
        const userid = "670aabcab6d45cfe6d008564"
        const jwtToken = jsonwebtoken.sign(userid, process.env.JWT_KEY)

        beforeAll((done) => {
            let user = new UserModel({
                "_id": userid,
                "email": "example2@test.com",
                "hashedPassword": "password",
                "pseudo": "Example2"
            })
            user.save().then((user) => {
                done()
            })
        })

        it("Update User", (done) => {
            supertest(app)
                .put(`/api/users/${userid}`)
                .set('Authorization', `Bearer ${jwtToken}`)
                .expect(200)
                .send({
                    "email": "example2@test.fr",
                })
                .end((err, res) => {
                    expect(res.body).toEqual({
                        "_id": userid,
                        "email": "example2@test.fr",
                        "pseudo": "Example2",
                        "role": "client"
                    })
                    if (err) return done(err);
                    return done();
                });
        })

        it("Get User", (done) => {
            supertest(app)
                .get(`/api/users/${userid}`)
                .set('Authorization', `Bearer ${jwtToken}`)
                .end((err, res) => {
                    expect(res.body).toEqual({
                        "_id": userid,
                        "email": "example2@test.fr",
                        "pseudo": "Example2",
                        "role": "client"
                    })
                    if (err) return done(err);
                    return done();
                });
        })

        it("Delete User", (done) => {
            supertest(app)
                .delete(`/api/users/${userid}`)
                .set('Authorization', `Bearer ${jwtToken}`)
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