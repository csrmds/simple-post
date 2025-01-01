import Post from "../models/post.js"
import PostImage from "../models/postImage.js"
import fs from 'fs/promises'
import path from 'path'

export const insertPost = async (req, res) => {
    try {
        console.log("\n\n=======CONTROLLER insertPost=======\n")
        const files = req.files
        const newPost = new Post(req.body)
        console.log('req.body: ', req.body, '\n')
        const savedPost = await newPost.save()
        console.log("Post criado com sucesso: ", savedPost)


        if (files) {
            //const pathImages= './src/backend/files/postImages/'
            const pathImages= process.env.NEXT_PUBLIC_POST_IMAGE_PATH
            
            // console.log('process path images: ', pathImages)
            // console.log('files array: ')
            // files.forEach((value, key) => {
            //     console.log(`${key}: ${value}`)
            // })

            try {
                files.map(async (file, i) => {
                    
                    const extension = path.extname(pathImages+file.filename)
                    const newFileName= `${savedPost._id}_${i}${extension}`
                    await fs.rename(pathImages+file.filename, pathImages+`${newFileName}`)


                    const newPostImage = new PostImage({
                        postId: savedPost._id,
                        address: pathImages+newFileName,
                        description: file.filename,
                        mimetype: file.mimetype,
                        size: file.size,
                    })
                    const savedPostImage = await newPostImage.save()
                    console.log(`Imagem salva order[${i}]`, savedPostImage)
                })
            } catch (error) {
                console.log("Erro ao salvar imagem: ", error)
                res.status(500).json({ message: "Erro ao salvar imagem" })
            }
        }
        

        res.status(200).json({error: false, message: "Post criado com sucesso.", postId: savedPost._id})
    } catch (error) {
        console.log("Erro ao criar post: ", error)
        res.status(500).json({ error: true, message: "Erro ao criar post" })
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

export const testFile = async (req, res) => {
    try {
        const pathImages= './src/backend/files/postImages/'
        const listFiles = await fs.readdir(pathImages)
        const file = await fs.stat(pathImages + listFiles[0])
        const response = await fs.rename(pathImages + listFiles[0], pathImages + 'renomeado.jpg')


        res.status(200).json({ message: "Arquivo lido com sucesso", response})
    } catch (error) {
        console.log("Erro ao testar arquivo: ", error)
        res.status(500).json({ message: "Erro ao testar arquivo" })
    }
}