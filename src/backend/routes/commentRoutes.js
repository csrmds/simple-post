const express= require('express')
const { insertComment, getComments }= require('../controllers/commentController')


const router= express.Router()

router.post('/insert', insertComment)
router.post('/', getComments)

module.exports= router 