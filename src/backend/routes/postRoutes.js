import express from 'express'
import multer from 'multer'
import { insertPost, getPosts, getPostById, updatePost, testFile } from '../controllers/postController.js'

const router = express.Router()

//DEFINIÇÃO DE ARMAZENAMENTO COM MULTER
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/backend/files/postImages/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})
const upload = multer({ storage })




//ROTAS
router.post('/teste', testFile)
router.post('/insert', upload.array('post-image'), insertPost )
router.get('/', getPosts )
router.get('/:id', getPostById )
router.post('/update', updatePost )


export default router