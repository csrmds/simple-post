import express from 'express'
import multer from 'multer'
import { insertPost } from '../controllers/postController.js'

const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../files/postImages')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({ storage })

router.post('/insert', upload.array('post-image', 10), insertPost )

export default router