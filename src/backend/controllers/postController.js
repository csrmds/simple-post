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
                        source: "local"
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

const getPostsPaginate = async (req, res) => {
    console.log("\n\n------Controller getPostsAggregate------")
    console.log("body: ",req.body, "\nQuery: ", req.query, "\nParams:", req.params)
    let pipeLine= []
    let postId= null

    if (req.body.postId || req.query.postId || req.params.postId) {
        postId= new mongoose.Types.ObjectId(req.body.postId || req.query.postId || req.params.postId)
        pipeLine.push({
            $match: { _id: postId }
        })
    }

    const order= parseInt(req.body.order || req.query.order || req.params.order || -1) 
    const limit= parseInt(req.body.limit || req.query.limit || req.params.limit || 10) 
    const page= parseInt(req.body.page || req.query.page || req.params.page || 1)
    //const postId= new mongoose.Types.ObjectId(req.body.postId || req.query.postId || req.params.postId)

    try {
        pipeLine.push(
            //lookup para imagens do post
            { 
                $lookup: {
                    from: "postimages",
                    localField: "_id",
                    foreignField: "postId",
                    as: "images"
                },
            },
            
            //lookup para comentarios do post
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "foreignId",
                    as: "comments"
                },    
            },
            
            //lookup para usuário dos comentarios
            {
                $lookup: {
                    from: "useraccounts",
                    localField: "comments.userAccountId",
                    foreignField: "_id",
                    as: "commentUser"
                }
            },

            //lookup para likes dos comentários
            {
                $lookup: {
                    from: "likes",
                    localField: "comments._id",
                    foreignField: "foreignId",
                    as: "commentLikes"
                }
            },

            //lookup para usuario dos likes dos comentarios
            {
                $lookup: {
                    from: "useraccounts",
                    localField: "commentLikes.userAccountId",
                    foreignField: "_id",
                    as: "commentLikeUser"
                }
            },

            //lookup para usuario do post
            {
                $lookup: {
                    from: "useraccounts",
                    localField: "userAccountId",
                    foreignField: "_id",
                    as: "author"
                }
            },

            //lookup para likes do post
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "foreignId",
                    as: "likes"
                }
            },

            //lookup para usuarios dos likes do post
            {
                $lookup: {
                    from: "useraccounts",
                    localField: "likes.userAccountId",
                    foreignField: "_id",
                    as: "postLikeUser"
                }
            },

            //adicionando autor e os likes dos comenatarios
            {
                $addFields: {
                    comments: {
                        $map: {
                            input: "$comments",
                            as: "comment",
                            in: {
                                _id: "$$comment._id",
                                foreignId: "$$comment.foreignId",
                                text: "$$comment.text",
                                type: "$$comment.type",
                                userAccountId: "$$comment.userAccountId",
                                createdAt: "$$comment.createdAt",
                                updatedAt: "$$comment.updatedAt",
                                user: {
                                    $arrayElemAt: [
                                        //arrayElemAt -> tranforma o array em um objeto. user: [{...}] > user: {...}
                                        {
                                            $filter: {
                                                input: "$commentUser",
                                                as: "user",
                                                cond: { $eq: ["$$user._id", "$$comment.userAccountId"] }
                                            }
                                        }, 0
                                    ]
                                },
                                likes: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: "$commentLikes",
                                                as: "likes",
                                                cond: { $eq: ["$$likes.foreignId", "$$comment._id"] }
                                            }
                                        },
                                        as: "likes",
                                        in: {
                                            _id: "$$likes._id",
                                            foreignId: "$$likes.foreignId",
                                            userAccountId: "$$likes.userAccountId",
                                            createdAt: "$$likes.createdAt",
                                            user: {
                                                $arrayElemAt: [{
                                                    $filter: {
                                                        input: "$commentLikeUser",
                                                        as: "user",
                                                        cond: { $eq: ["$$user._id", "$$likes.userAccountId"] }
                                                    }
                                                },0]
                                            }
                                        },
                                        
                                    }
                                }
                            }
                        }
                    },

                    likes: {
                        $map: {
                            input: "$likes",
                            as: "likes",
                            in: {
                                _id: "$$likes._id",
                                createdAt: "$$likes.createdAt",
                                user: {
                                    $arrayElemAt: [{
                                        $filter: {
                                            input: "$postLikeUser",
                                            as: "user",
                                            cond: { $eq: ["$$user._id", "$$likes.userAccountId"] }
                                        }
                                    }, 0]
                                }
                            }
                        }
                    }
                }
            },
            
            //retorna apenas os campos desejados
            { 
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    images: { address: 1, description: 1, source: 1 },
                    comments: { 
                        _id: 1,
                        foreignId: 1,
                        text: 1,
                        type: 1,
                        likes: { 
                            _id: 1,
                            foreignId: 1,
                            user: {
                                _id: 1,
                                userName: 1,
                                email: 1,
                            }
                        },
                        user: { 
                            _id: 1, 
                            avatarImage: 1, 
                            firstName: 1, 
                            lastName: 1 
                        },
                        createdAt: 1,
                        updatedAt: 1,
                    },
                    author: { _id: 1, "avatarImage": 1, "firstName": 1, "lastName": 1 },
                    likes: { 
                        _id: 1,
                        foreignId: 1,
                        user: {
                            _id: 1,
                            avatarImage: 1, 
                            firstName: 1, 
                            lastName: 1,
                        },
                        createdAt: 1 },
                    createdAt: 1,
                } 
            },
            { $sort: { createdAt: order } },
        )

        const options = { page, limit }
        const posts = await Post.aggregatePaginate(Post.aggregate(pipeLine), options)
        res.status(200).json(posts)
    } catch (error) {
        console.log("Erro ao buscar post: ", error)
        res.status(500).json({ message: "Erro ao buscar post" })
    }
}

const getPostsAggregate = async (req, res) => {
    // console.log("\n\n------Controller getPostsAggregate------")
    // console.log('req: ', "body: ",req.body.limit, "\nQuery: ", req.query.limit, "\nParams:", req.params.limit)
    const order= parseInt(req.body.order || req.query.order || req.params.order || -1) 
    const limit= parseInt(req.body.limit || req.query.limit || req.params.limit || 10) 
    const page= 1

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
    getPostsPaginate,
    getPostsAggregate, 
    updatePost, 
    testFile,
    deletePost
}