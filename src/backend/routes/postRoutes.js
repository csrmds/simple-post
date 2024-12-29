import express from 'express'
import multer from 'multer'
import { insertPost, getPosts, getPostById, updatePost } from '../controllers/postController.js'

const router = express.Router()

//FORMATAÇÃO PARA EXIBIÇÃO DE DATA
const now= new Date(Date.now())
const d= String(now.getDate()).padStart(2, '0')
const m= String(now.getMonth() + 1).padStart(2, '0')
const y= now.getFullYear()
const h= String(now.getHours()).padStart(2, '0')
const min= String(now.getMinutes()).padStart(2, '0')
const s= String(now.getSeconds()).padStart(2, '0')

//DEFINIÇÃO DE ARMAZENAMENTO COM MULTER
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/backend/files/postImages/')
    },
    filename: (req, file, cb) => {
        cb(null, `${d}-${m}-${y}_${h}${m}${s}_${file.originalname}`)
    }
})
const upload = multer({ storage })




//ROTAS
router.post('/insert', upload.array('post-image'), insertPost )
//router.post('/insert', insertPost )
//router.post('/insert', upload.single('post-image'), insertPost )
router.get('/', getPosts )
router.get('/:id', getPostById )
router.post('/update', updatePost )


export default router