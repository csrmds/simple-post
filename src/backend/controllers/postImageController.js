const { default: mongoose } = require('mongoose')
const PostImage = require('../models/postImage')
const fs = require('fs/promises')
const path = require('path')
const {fileListRenameOrder} = require('../utils/commonFunctions')


const insertPostImage = async (req, res) => {
    console.log("-----insertPostImage Controller-----")

    try {

    } catch(err) {
        console.error("Não foi possível inserir as imagens do post.", err)
        res.status(500).json({message: "Não foi possível inserir as imagens do post.", error: err})
    }
}


const deletePostImage = async (req, res) => {
    console.log("-----deletePostImage Controller-----")

    let imageId= ""
    let image= ""
    
    if (req.body.imageId || req.query.imageId || req.params.imageId) {
        imageId = new mongoose.Types.ObjectId(req.body.imageId || req.query.imageId || req.params.imageId)  
    } else {
        res.status(500).json({message: "Id da imagem não foi recebida corretamente"})
    }

    try {
        image= await PostImage.findById(imageId)
        fs.unlink(image.address)
    } catch(err) {
        console.error("Não foi possível deletar o arquivo da imagem.", err, "\nEndereço: ", image.address)
    }

    try {
        const response = await PostImage.findByIdAndDelete(imageId)

        const filesRenamed= await fileListRenameOrder(image.postId)
        console.log("FilesRenamed: ", filesRenamed)

        res.status(200).json({response, filesRenamed})
    } catch(err) {
        console.error("Não foi possível deletar as imagens do banco de dados.", err)
        res.status(500).json({message: "Não foi possível deletar a imagem do banco de dados.", error: err})
    }
}


const updatePostImage = async (req, res) => {
    console.log("-----updatePostImage Controller-----")

    try {

    } catch(err) {
        console.error("Não foi possível atualizar as imagens do post.", err)
        res.status(500).json({message: "Não foi possível atualizar as imagens do post.", error: err})
    }
}


const getPostImage = async (req, res) => {
    //console.log("-----getPostImages Controller-----")

    let postId= ""
    
    if (req.body.postId || req.query.postId || req.params.postId) {
        postId = new mongoose.Types.ObjectId(req.body.postId)  
    } else {
        res.status(500).json({message: "Id da imagem não foi recebida corretamente"})
    }

    try {
        const response = await PostImage.find({ postId: postId })
            .sort({createdAt: 1})

        res.status(200).json(response)
    } catch(err) {
        console.error("Não foi possível carregar as imagens do post.", err)
        res.status(500).json({message: "Não foi possível carregar as imagens do post.", error: err})
    }
}

const getImageById = async (req, res) => {
    //console.log("-----getPostImages Controller-----")

    let imageId= ""

    if (req.body.imageId || req.query.imageId || req.params.imageId) {
        imageId = new mongoose.Types.ObjectId(req.body.imageId)  
    } else {
        res.status(500).json({message: "Id da imagem não foi recebida corretamente"})
    }
    

    try {
        const response = await PostImage.findById(imageId)
    } catch(err) {
        console.error("Não foi possível carregar a imagem.", err)
        res.status(500).json({message: "Não foi possível carregar a imagen.", error: err})        
    }

}



module.exports = {
    insertPostImage,
    deletePostImage,
    updatePostImage,
    getPostImage,
    getImageById
}