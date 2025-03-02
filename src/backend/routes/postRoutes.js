const express= require('express')
const multer= require('multer')
const { insertPost, getPosts, getPostById, getPostsFilter, getPostsPaginate, getPostsAggregate, updatePost, testFile, deletePost }= require('../controllers/postController')

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
router.post('/', getPostsFilter )
router.use('/aggregate', getPostsAggregate)
router.use('/list', getPostsPaginate)
//router.get('/', getPosts )
router.get('/:id', getPostById )
router.post('/update', updatePost )
router.post('/delete', deletePost)


module.exports= router