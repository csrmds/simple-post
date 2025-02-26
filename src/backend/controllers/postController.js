const { default: mongoose } = require('mongoose')
const Post= require('../models/post.js')
const PostImage= require('../models/postImage.js')
const Like = require('../models/like.js')
const Comment = require ('../models/comment.js')
const fs= require('fs/promises')
const path= require('path')


const insertPost = async (req, res) => {
    try {
        console.log("\n\n=======CONTROLLER insertPost=======\n")
        const files = req.files
        const newPost = new Post(req.body)
        console.log('req.files: ', req.files, '\n')
        const savedPost = await newPost.save()
        console.log("Post criado com sucesso: ", savedPost)


        if (files) {
            //const pathImages= './src/backend/files/postImages/'
            const pathImages= process.env.NEXT_PUBLIC_POST_IMAGE_PATH
            
            console.log('process path images: ', pathImages)
            console.log('files array: ')
            files.forEach((value, key) => {
                console.log(`${key}: ${value}`)
            })

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

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        console.log("Erro ao listar posts: ", error)
        res.status(500).json({ message: "Erro ao listar posts" });
    }
}

const getPostsFilter = async (req, res) => {
    try {
        var order = req.body.order || 1
        var limit = req.body.limit || 15


        const posts = await Post.find()
            .sort({createdAt: order})
            .limit(limit)
        res.status(200).json(posts)
    } catch (error) {
        console.log("Erro ao listar posts: ", error)
        res.status(500).json({ message: "Erro ao listar posts" });
    }
}

const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        //console.log("Post encontrado com sucesso: ", post)
        res.status(200).json(post)
    } catch (error) {
        console.log("Erro ao buscar post: ", error)
        res.status(500).json({ message: "Erro ao buscar post" })
    }
}

const getPostsAggregate = async (req, res) => {
    console.log("\n\n------Controller getPostsAggregate------")
    //console.log('req.body: ', req.body)
    const order= req.body.order || -1
    const limit= req.body.limit || 5

    try {
        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: "postimages",
                    localField: "_id",
                    foreignField: "postId",
                    as: "images"
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "foreignId",
                    as: "comments"
                }
            },
            {
                $unwind: {  path: "$comments", preserveNullAndEmptyArrays: true  }
            },
            {
                $lookup: {
                    from: "useraccounts",
                    localField: "comments.userAccountId",
                    foreignField: "_id",
                    as: "comments.author"
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "comments._id",
                    foreignField: "foreignId",
                    as: "comments.likes"
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
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    content: { $first: "$content" },
                    images: { $first: "$images" },
                    comments: { $push: "$comments" },
                    likes: { $first: "$likes" },
                    userAccountId: { $first: "$userAccountId" },
                    createdAt: { $first: "$createdAt" },
                }
            },
            {
                $lookup: {
                    from: "useraccounts",
                    localField: "userAccountId",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $sort: {createdAt: order} },
            { $limit: limit }
        ])
        //console.log("Lista de posts...", posts)
        res.status(200).json(posts)
    } catch (error) {
        console.log("Erro ao buscar post: ", error)
        res.status(500).json({ message: "Erro ao buscar post" })
    }
}

const updatePost = async (req, res) => {

    console.log("\n\nupdatePost body:\n", req.body)

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

const deletePost = async (req, res) => {
    console.log("\n\n------Controller Delete Post------\nPostId: ",req.body.postId)
    const postId = new mongoose.Types.ObjectId(req.body.postId)
    let deletedLikes= ""

    try {
        //const deletedLikes = await Like.deleteMany({ foreignId: postId })
        const comments = await Comment.find({ foreignId: postId })
        console.log("\nDeletedLikes: ")
        comments.map( async (comment)=> {
            deletedLikes = await Like.deleteMany({ foreignId: comment._id })
            console.log(deletedLikes)
        })

        const deletedComments = await Comment.deleteMany({ foreignId: postId })
        console.log("deletedComments: ", deletedComments)

        const deletedLikesPost = await Like.deleteMany({ foreignId: postId })
        console.log("\n\nDeleted Likes Post:", deletedLikesPost)

        console.log("\n\nDeletando imagens do post:")
        const postImages = await PostImage.find({ postId: postId })
        postImages.map((image)=> {
            //console.log(image.address)
            try {
                fs.unlink(image.address)
            } catch (err) {
                console.log("erro ao deletar arquivo: ", image.address, "\n", err)
            }
        })
        const deletedImages = await PostImage.deleteMany({ postId: postId }) 
        console.log("deletedImagesDB: ", deletedImages)

        const deletedPost = await Post.findByIdAndDelete(postId)
        console.log("\n\nDeleted post:", deletedPost)
        //console.log("post deletado: ", response)
        res.status(200).json({ deletedLikes, deletedComments, deletedLikesPost, deletedImages, deletedPost })
    } catch(err) {
        console.log("Erro ao deletar post: ", err)
        res.status(500).json({ message: "Erro ao deletar post" })
    }

}

const testFile = async (req, res) => {
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


module.exports= {
    insertPost, 
    getPosts, 
    getPostById, 
    getPostsFilter, 
    getPostsAggregate, 
    updatePost, 
    testFile,
    deletePost
}