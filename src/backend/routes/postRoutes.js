import express from 'express'
import { insertPost, getPosts, getPostById, updatePost } from '../controllers/postController.js'

const router = express.Router()


router.post('/insert', insertPost )
router.get('/', getPosts )
router.get('/:id', getPostById )
router.post('/update', updatePost )


export default router