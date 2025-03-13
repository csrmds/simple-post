const { default: mongoose } = require('mongoose')
const Comment= require('../models/comment')
const Like = require('../models/like')

const insertComment = async (req, res) => {
    try {
        console.log("\n\n=======CONTROLLER insertComment=======\n")
        //console.log(req.body)
        
        const newComment= new Comment(req.body)
        const savedComment= await newComment.save()

        res.status(200).json(savedComment)
    } catch (error) {
        console.log("Erro ao inserir comentario: ", error)
        res.status(500).json({ message: "Erro ao inserir comentario" });
    }

}

const deleteComment = async (req, res) => {
    const commentId= new mongoose.Types.ObjectId(req.body.commentId)
    try {
        console.log("\n\n=======CONTROLLER Delete Comment=======\n")
        console.log(commentId)

        const responseLike = await Like.deleteMany( { foreignId: commentId })

        const responseComment = await Comment.findByIdAndDelete(commentId)
        res.status(200).json({ responseLike, responseComment})
    } catch (err) {
        console.log("Erro ao deletar comentario: ", err)
        res.status(500).json({ message: "Erro ao deletar comentario" });
    }
}

const getComments = async (req, res) => {
    try {
        const foreignId= new mongoose.Types.ObjectId(req.body.postId)
        //const postId= new mongoose.Types.ObjectId("67afadedb021ea28886d7ae2")
        console.log("\n\n--------GetComments Controller--------\nforeignId: ", foreignId)
        console.log("req.body: ", req.body)
        const comments= await Comment.aggregate([
            {
                $match: { foreignId: new mongoose.Types.ObjectId(foreignId) }
            },
            {
                $lookup: {
                    from: "useraccounts",
                    localField: "userAccountId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "foreignId",
                    as: "likes"
                }
            },
            {
                $unwind: {  path: "$likes", preserveNullAndEmptyArrays: true  }
            },
            {
                $lookup: {
                    from: "useraccounts",
                    localField: "likes.userAccountId",
                    foreignField: "_id",
                    as: "likes.user"
                }
            },

        ])
        console.log("comments response: ",comments)
        res.status(200).json(comments)
    } catch (error) {
        console.log("\nErro ao buscar comentarios: ", error)
        res.status(500).json({ message: "Erro ao buscar comentarios" });
    }
}

module.exports= {
    insertComment,
    deleteComment,
    getComments
}