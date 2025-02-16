const { default: mongoose } = require('mongoose')
const Comment= require('../models/comment')

const insertComment = async (req, res) => {
    try {
        console.log("\n\n=======CONTROLLER insertComment=======\n")
        console.log(req.body)
        
        const newComment= new Comment(req.body)
        const savedComment= await newComment.save()

        res.status(200).json(savedComment)
    } catch (error) {
        console.log("Erro ao inserir comentario: ", error)
        res.status(500).json({ message: "Erro ao inserir comentario" });
    }

}

const getComments = async (req, res) => {
    try {
        const postId= new mongoose.Types.ObjectId(req.body.postId) 
        console.log("\n\n--------GetComments Controller--------\nPostId: ", postId)
        const comments= await Comment.aggregate([
            {
                $match: { postId: new mongoose.Types.ObjectId(postId) }
            },
            {
                $lookup: {
                    from: "useraccounts",
                    localField: "userAccountId",
                    foreignField: "_id",
                    as: "author"
                }
            }
        ])

        res.status(200).json(comments)
    } catch (error) {
        console.log("\nErro ao buscar comentarios: ", error)
        res.status(500).json({ message: "Erro ao buscar comentarios" });
    }
}

module.exports= {
    insertComment,
    getComments
}