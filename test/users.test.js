import 'dotenv/config'
import { closeDatabase, connect } from './utils/mongoose.js'
import { magika } from "../src/magika.js"
import { InsertMockUser } from './utils/mockuser.js';
import { userid, jwtToken} from "./utils/mockuser.js"
import supertest from "supertest";
import { app } from "../src/app.js";
import { UserRoles } from '../src/enums/userroles.js';

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
                expect(res.body.role).toBe(UserRoles.CLIENT)
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
        beforeAll((done) => {
            InsertMockUser(UserRoles.ADMIN).then(() => {
                done()
            })
        })
        
        it("Update a User", (done) => {
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
                        "role": UserRoles.ADMIN
                    })
                    if (err) return done(err);
                    return done();
                });
        })

        it("Get a User", (done) => {
            supertest(app)
                .get(`/api/users/${userid}`)
                .set('Authorization', `Bearer ${jwtToken}`)
                .end((err, res) => {
                    expect(res.body).toEqual({
                        "_id": userid,
                        "email": "example2@test.fr",
                        "pseudo": "Example2",
                        "role": UserRoles.ADMIN
                    })
                    if (err) return done(err);
                    return done();
                });
        })

        it("Delete a User", (done) => {
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