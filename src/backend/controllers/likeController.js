const { mongoose } = require('mongoose')
const Like= require('../models/like')

const insertLike= async (req, res) => {
    const like= {
      from: req.body.like.from,
      foreignId: new mongoose.Types.ObjectId(req.body.like.foreignId),
      userAccountId: req.body.like.userAccountId
    }

    try {
        console.log("\n\n=======LIKE CONTROLLER insert=======\n")
        console.log(like)
        console.log(req.body)
        const newLike= new Like(like)
        const savedLike= await newLike.save()

        res.status(200).json(savedLike)
    } catch (err) {
        console.log("Erro ao inserir like: ", err)
        res.status(500).json({ message: "Erro ao inserir like" });
    }
}

const checkLike= async (req, res) => {
    const {from, foreignId, userAccountId} = req.body

    try {
        console.log("\n\n=======LIKE CONTROLLER check=======\n")
        console.log(req.body)
        const response= await Like.findOne({
            from: from,
            foreignId: foreignId,
            userAccountId: userAccountId
        })

        //return !!response
        return response ? true : false

    } catch (err) {
        console.log("Erro ao verificar like: ", err)
        res.status(500).json({ message: "Erro ao verificar like" });
    }
}

const removeLike= async (req, res) => {
    try {
        console.log("\n\n=======LIKE CONTROLLER remove=======\n")
        console.log(req.body)

        const response= await Like.findByIdAndDelete(req.body.likeId)

        return response ? true : false

    } catch (err) {
        console.log("Erro ao remover like: ", err)
        res.status(500).json({ message: "Erro ao remover like" });
    }
}

const listLikesByPost= async (req, res) => {
    try {
        console.log("\n\n=======LIKE CONTROLLER listLikesByPost=======\n")
        console.log(req.body)

        const response= await Like.find({
            from: "post",
            foreignId: req.body.postId
        })

    } catch (err) {
        console.log("Erro ao listar likes: ", err)
        res.status(500).json({ message: "Erro ao listar likes:" });
    }
}

const listLikesByComment= async (req, res) => {
    try {
        console.log("\n\n=======LIKE CONTROLLER listLikesByComment=======\n")
        console.log(req.body)

        const response= await Like.find({
            from: "comment",
            foreignId: req.body.commentId
        })

    } catch (err) {
        console.log("Erro ao listar likes: ", err)
        res.status(500).json({ message: "Erro ao listar likes:" });
    }
}


module.exports= {
    insertLike,
    checkLike,
    removeLike,
    listLikesByPost,
    listLikesByComment
}