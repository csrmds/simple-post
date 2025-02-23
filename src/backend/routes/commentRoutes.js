const express= require('express')
const { insertComment, getComments, deleteComment }= require('../controllers/commentController')


const router= express.Router()

router.post('/insert', insertComment)
router.post('/delete', deleteComment)
router.use('/', getComments)

module.exports= router 