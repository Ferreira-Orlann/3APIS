import 'dotenv/config'
import { closeDatabase, connect } from './utils/mongoose'
import { magika } from "../src/magika.js"

describe("Authentication", () => {
    beforeAll(() => {
        connect()
        magika.load()
    })

    describe("Register", () => {

    })

    describe("Login", () => {

    })

    afterAll(() => {
        closeDatabase()
    })
})