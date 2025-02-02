const express= require('express')
const { insertComment, getComments }= require('../controllers/commentController')


const router= express.Router()

router.post('/insert', insertComment)
router.get('/', getComments)

module.exports= router 