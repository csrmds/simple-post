import Post from "../models/post.js"
import PostImage from "../models/postImage.js"

export const insertPost = async (req, res) => {
    try {
        console.log("\n\n=======CONTROLLER insertPost=======\n")
        const files = req.files
        const newPost = new Post(req.body)
        console.log('req.body: ', req.body, '\n')
        const savedPost = await newPost.save()
        console.log("Post criado com sucesso: ", savedPost)

        //console.log('req.files: ', files)
        
        const formData = req.files

        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`)
        })

        if (files) {
            // try {
            //     const newPostImage = new PostImage({
            //         postId: savedPost._id,
            //         address: files[0].path,
            //         description: files[0].filename
            //     })
            //     const savedPostImage = await newPostImage.save()
            //     console.log("Imagem salva: ", savedPostImage)
            // } catch (error) {
            //     console.log("Erro ao salvar imagem: ", error)
            //     res.status(500).json({ message: "Erro ao salvar imagem" })
            // }
            
            try {
                files.map(async (file) => {
                    const newPostImage = new PostImage({
                        postId: savedPost._id,
                        address: file.path,
                        description: file.filename
                    })
                    const savedPostImage = await newPostImage.save()
                    console.log("Imagem salva: ", savedPostImage)
                })
            } catch (error) {
                console.log("Erro ao salvar imagem: ", error)
                res.status(500).json({ message: "Erro ao salvar imagem" })
            }
        }
        

        res.status(200).json({ message: files })
    } catch (error) {
        console.log("Erro ao criar post: ", error)
        res.status(500).json({ message: "Erro ao criar post" })
    }
}

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        console.log("Erro ao listar posts: ", error)
        res.status(500).json({ message: "Erro ao listar posts" });
    }
}

export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        console.log("Post encontrado com sucesso: ", post)
        res.status(200).json(post)
    } catch (error) {
        console.log("Erro ao buscar post: ", error)
        res.status(500).json({ message: "Erro ao buscar post" })
    }
}

export const updatePost = async (req, res) => {

    try {
        console.log('req body: ', req.body)
        const post = req.body
        const postUpdate= await Post.findByIdAndUpdate(post.postId, {title: post.title, content: post.content}, {new: true})
        console.log("Post atualizado com sucesso:", postUpdate)
        res.status(200).json(postUpdate)
    } catch (error) {
        console.log("Erro ao atualizar post: ", error)
        res.status(500).json({ message: "Erro ao atualizar post" })
    }

}