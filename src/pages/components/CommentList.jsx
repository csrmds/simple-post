import { useEffect, useState } from "react"
import { useSession } from 'next-auth/react'
import mongoose from "mongoose"
import axios from "axios"



export default function commentList(props) {
    const url= process.env.NEXT_PUBLIC_BACKEND_URL
    const {data: session} = useSession()
    const [comments, setComments] = useState(props.comments)
    const [likes, setLikes]= useState(props.comments.likes)
    const [liked, setLiked] = useState()

    useEffect(()=> {
        //console.log("comment list component useEffect: ")
        // console.log(comments[0].author[0])
        //setComments(props.comments) //se eu habilitar isso aqui vai dar ruim no comment.likes.find(), se eu ñ habilitar, ñ atualiza a lista de comentários...
        //console.log(comments)
    }, [props.comments])



    const likeAdd = async (commentId) => {
        console.log("\n------Like Add------\n")
        console.log("comments ANTES de atualizar: \n", comments)
        const like= {
            from: "comment",
            foreignId: commentId,
            userAccountId: session?.user?.id
        }

        try {
            //console.log("\ntry/catch - like: ", like)
            const response = await axios.post(`${url}/like/insert`, {like})
            console.log(response.data)
            refreshLikes(commentId)
        } catch (err) {
            console.log("\nErro ao inserir Like: ", err)
        }
    }

    const unLike = async (likeId) => {
        console.log("\n------unLike------\n")
        //console.log("param LikeId: ",likeId)
        //const before = await axios.post(`${url}/like/comment`, { commentId: likeId.foreignId })
        console.log("comments ANTES de atualizar: \n", comments)

        try {
            const response = await axios.post(`${url}/like/remove`, {likeId: likeId._id})
            console.log(response.data)
            refreshLikes(likeId.foreignId)
        } catch (err) {
            console.log("\nErro ao remover Like: ", err)
        }
    }

    const checkLike = async (commentId) => {
        console.log("\n------checkLike------\n")
        const like= {
            from: "comment",
            foreignId: commentId,
            userAccountId: session?.user?.id
        }

        try {
            const response = await axios.post(`${url}/like/check`, {like})
            console.log("check response: ",response)
            setLiked(response.data)
        } catch (err) {
            console.log("Erro ao verificar o like: ", err)
        }

    }

    const refreshLikes= async (commentId)=> {
        console.log("\n----RefreshLikes----\n")
        try {
            const response = await axios.post(`${url}/like/comment`, { commentId })
            //procura o comentario pelo commentId e atualiza a chave "likes" com response.data 
            //e mantem os outros dados sem alterações.
            setComments(prevComments => 
                prevComments.map(comment =>
                    comment._id === commentId ? {...comment, likes: response.data} : comment
                )
            )
            console.log("comments DEPOIS de atualizar: \n", comments)
        } catch (err) {
            console.log("\nErro ao atualizar lista de likes: ", err)
        }
    }

    const getLikes = async (commentId) => {
        console.log("\n----getLikes----\n")
        try {
            const response = await axios.post(`${url}/like/comment`, {commentId})
            console.log(response.data)
        } catch (err) {
            console.log("\nErro ao listar likes: ", err)
        }
    }





    const teste = () => {
        console.log("botao teste: ", comments)
    }

    return (
        <>
            <div className="flex justify-center overflow-y-auto pt-5 mb-4">
                <div className="flex flex-col max-h-80">
                {
                    comments.length > 0 ? (
                        comments.map((comment, i) => (
                            <div className="indicator my-1" key={i}>
                                <span className="indicator-item indicator-middle indicator-start badge">
                                    <img
                                        className="h-12 w-12 rounded-full"
                                        alt="Tailwind CSS examples"
                                        src={comment.author[0]?.avatarImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                                </span>
                                <div className="card border w-120">
                                    <div className="card-body p-4 ">
                                        <p className="pl-4">{comment.text}</p>
                                    </div>
                                    <div className="card-actions justify-end pr-4 pb-2">
                                        <p className="pl-8">{comment.author[0]?.firstName}</p>
                                        
                                        <div className='indicator'>
                                            <div className="indicator-item badge badge-default badge-sm">{comment.likes?.length > 0 ? comment.likes?.length : ""}</div>
                                            {
                                                comment?.likes && comment.likes.find(like => like.userAccountId== session?.user?.id) ? (
                                                    <button className="btn btn-sm" onClick={() => unLike(comment.likes.find(like => like.userAccountId== session?.user?.id))} >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                                        </svg>
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-sm" onClick={() => likeAdd(comment._id)} >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                        </svg>
                                                    </button>
                                                )
                                            }
                                            
                                        </div>
                                        
                                        
                                        <button className="btn btn-sm" >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                            </svg>
                                        </button>
                                        
                                        {/* <button className="btn btn-sm" onClick={()=> refreshLikes(comment._id)} > refreshLikes </button> */}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <br></br>
                    )
                }
                </div>
            </div>
            

            






            
            
        </>
    )   

}