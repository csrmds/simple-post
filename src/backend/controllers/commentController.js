import Comment from '../models/comment.js'

export const insertComment = async (req, res) => {
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

export const getComments = async (req, res) => {
    try {
        const comments= Comment.find()
        res.status(200).json(comments)
    } catch (error) {
        console.log("Erro ao inserir comentario: ", error)
        res.status(500).json({ message: "Erro ao inserir comentario" });
    }
}