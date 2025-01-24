import express from 'express'
import { insertComment, getComments } from '../controllers/commentController.js'

const router= express.Router()

router.post('/insert', insertComment)
router.get('/', getComments)

export default router