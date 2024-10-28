import { FileModel } from "../../src/models/file.js"
import { readFile } from "node:fs/promises"

export function InsertMockFile(id, path, mimetype, filename, upload_time) {
    return new Promise((resolve, reject) => {
        readFile(path).then((buffer) => {
            let file = new FileModel({
                _id: id,
                mimetype: mimetype,
                filename: filename,
                upload_time: upload_time,
                buffer: buffer
            })
            file.save().then((file) => {
                resolve(file)
            })
        })
    })
}
