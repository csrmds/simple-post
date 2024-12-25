import express from 'express'
import { insertPost, getPosts, getPostById } from '../controllers/postController.js'

const router = express.Router()


router.get('/insert', insertPost )
router.get('/', getPosts )
router.get('/id', getPostById )


export default router