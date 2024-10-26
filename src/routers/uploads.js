import express from "express"
import { JwtAuth } from "../middlewares/jwtauth.js"
import { IsIdParamAValidObjectId } from "../middlewares/valididparam.js"
import { CreateFile, GetFile, DeleteFile } from "../controllers/uploads.js"
import { HasRole } from "../middlewares/hasrole.js"
import multer from "multer"
import { UserRoles } from "../enums/userroles.js"
import { FileFormatValidation } from "../middlewares/fileformatvalidation.js"

export const UploadRouter = express.Router()

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: process.env.UPLOAD_FILE_MAX_SIZE
    }
})

UploadRouter.param("id", IsIdParamAValidObjectId)
UploadRouter.get("/:id", GetFile)
UploadRouter.use(JwtAuth)
UploadRouter.post("/", HasRole(UserRoles.ADMIN), upload.single("file"), FileFormatValidation(["jpeg", "png", "webp"]), CreateFile)
UploadRouter.delete("/:id", HasRole(UserRoles.ADMIN), DeleteFile) 