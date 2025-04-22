const express = require('express')
const { insertPostImage, deletePostImage, updatePostImage, getPostImage, getImageById } = require('../controllers/postImageController')


const router= express.Router()

router.use('/insert', insertPostImage)
router.use('/delete', deletePostImage)
router.use('/update', updatePostImage)
router.use('/post', getPostImage)
router.use('/id', getImageById)


module.exports= router