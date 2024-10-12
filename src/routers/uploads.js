import express from "express"
import { JwtAuth } from "../middlewares/jwtauth.js"
import { IsIdParamAValidObjectId } from "../middlewares/valididparam.js"
import { CreateFile, GetFile } from "../controllers/uploads.js"
import { HasRole } from "../middlewares/hasrole.js"

export const UploadRouter = express.Router()

import multer from "multer"
import { HasPerm } from "../utils.js"
import { UserRoles } from "../enums/userroles.js"

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: process.env.UPLOAD_FILE_MAX_SIZE
    }
})

UploadRouter.get("/:id", IsIdParamAValidObjectId, GetFile)
UploadRouter.use(JwtAuth)
UploadRouter.post("/", HasRole(UserRoles.ADMIN), upload.single("file"), CreateFile)
