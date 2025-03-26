import { useEffect, useState } from "react"
import { useSession } from 'next-auth/react'
import axios from "axios"



export default function commentList(props) {
    const url= process.env.NEXT_PUBLIC_BACKEND_URL
    const {data: session} = useSession()
    const [comments, setComments] = useState(props.comments)
    // const [likes, setLikes]= useState(props.comments.likes)
    // const [liked, setLiked] = useState()
    const callRefreshComments= props.refreshComments

    useEffect(()=> {
        //console.log("useEffect comment list component\nprops.Comments:")
        // console.log(comments[0]?.user[0])
        setComments(props.comments) 
        //console.log(props.comments)
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


    const deleteComment = async (commentId) => {
        console.log("\n------deleteComment------\n")
        console.log("param commentId: ",commentId)
        //const before = await axios.post(`${url}/like/comment`, { commentId: likeId.foreignId })
        //console.log("comments ANTES de atualizar: \n", comments)

        try {
            const response = await axios.post(`${url}/comment/delete`, {commentId})
            console.log(response.data)
            callRefreshComments()
        } catch (err) {
            console.log("\nErro ao remover Like: ", err)
        }
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
                                        src={comment.user?.avatarImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                                </span>
                                <div className="card border w-120 bg-slate-800">
                                    <div className="card-body p-4 ">
                                        <p className="pl-4">{comment.text}</p>
                                    </div>
                                    <div className="card-actions justify-end pr-4 pb-2">
                                        <p className="pl-8">{comment.user?.firstName}</p>
                                        {/* <p className="pl-8">{comment._id}</p> */}
                                        
                                        <div className='indicator'>
                                            { comment.likes?.length > 0 && (
                                                <div className="indicator-item badge badge-default badge-sm">{comment.likes?.length}</div>
                                            )}
                                            {
                                                comment?.likes.length > 0 && comment.likes.find(like => like.userAccountId== session?.user?.id) ? (
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

                                        {
                                            comment?.user[0]?._id == session?.user?.id && (
                                                <button className="btn btn-sm" onClick={()=> deleteComment(comment._id)} >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>
                                            )
                                        }
                                        
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