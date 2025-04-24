const express = require('express')
const multer= require('multer')
const { insertPostImage, deletePostImage, updatePostImage, getPostImage, getImageById } = require('../controllers/postImageController')
const { uploadPostImage } = require('../controllers/cloudinaryController')


const router= express.Router()
const upload= multer({dest: './src/backend/files/temp/'})



router.use('/insert', insertPostImage)
router.use('/delete', deletePostImage)
router.use('/update', updatePostImage)
router.use('/post', getPostImage)
router.use('/id', getImageById)
router.use('/upload', upload.array('post-image'), uploadPostImage)

module.exports= router