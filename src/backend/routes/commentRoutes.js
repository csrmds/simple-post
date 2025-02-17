const express= require('express')
const { insertComment, getComments }= require('../controllers/commentController')


const router= express.Router()

router.post('/insert', insertComment)
router.use('/', getComments)

module.exports= router 