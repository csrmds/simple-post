import { useEffect } from "react"
import { useSession } from 'next-auth/react'
import { useDispatch, useSelector } from "react-redux"
import { format, intervalToDuration, formatDistanceToNowStrict  } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import axios from "axios"


export default function CommentList(props) {
    const url= process.env.NEXT_PUBLIC_BACKEND_URL
    const {data: session} = useSession()
    const postId= props.postId
    const callRefreshComments = props.refreshComments
    const callCommentEdit = props.callCommentEdit
    
    const comments = useSelector((state) => {
        const docs = state.postListReducer?.currentPostList?.docs ?? []
        const post = docs.find(post => post._id === postId)
        return post ? post.comments : []
    })
    //const testeComments= useSelector((state) => state.postListReducer.currentPostList.docs.map(post => post._id == postId && post.comments))

    const dispatch= useDispatch()
    //const postList= useSelector((state)=> state.postListReducer.currentPostList)


    useEffect(()=> {
        //console.log("useEffect comment list component\nCommentsState:")
        //console.log("PostId: ", postId)
        //setComments(props.comments)
        //console.log(testeComments)
    }, [])

    const likeAdd = async (commentId) => {
        console.log("\n------Like Add------\n")
        const like = {
            from: "comment",
            foreignId: commentId,
            userAccountId: session?.user?.id
        }

        try {
            await axios.post(`${url}/like/insert`, {like})
            //.finally( setTimeout(() => refreshCommentById(commentId), 0) )
            // console.log("Like: ", like)
            // console.log("Response: ", response.data)
        } catch (err) {
            console.error("\nErro ao inserir Like: ", err)
        } finally {
            refreshCommentById(commentId)
            //console.log("chamou finally refreshComments")
        }
    }

    const unLike = async (like) => {
        console.log("\n------unLike------\n")
        
        try {
            await axios.post(`${url}/like/remove`, {likeId: like._id})
            //console.log("response unLike: ", response.data)
            //console.log("Like param: ", like)
            //console.log(response.data)
        } catch (err) {
            console.error("\nErro ao remover Like: ", err)
        } finally {
            refreshCommentById(like.foreignId)
        }
    }

    const refreshCommentById = async (commentId) => {
        console.log("\n----RefreshComment----\n")
        try {
            const response = await axios.post(`${url}/comment`, {commentId: commentId})
            dispatch({
                type: 'postList/updateCommentById',
                payload: {commentId, comment: response.data[0]}
            })
        } catch (err) {
            console.error("\nErro ao atualizar comentário: ", err)
        }
    }

    const deleteComment = async (commentId) => {
        console.log("\n----DeleteComment----\n")
        try {
            await axios.post(`${url}/comment/delete`, {commentId: commentId})
                .finally( setTimeout(() => callRefreshComments(), 0) )
        } catch (err) {
            console.error("\nErro ao deletar comentário: ", err)
        }
    }

    const formatData = (updateAt) => {
        const result= formatDistanceToNowStrict(updateAt, {addSuffix: true, locale: ptBR})
        const interval= intervalToDuration({start: updateAt, end: Date.now()} )
        if (interval.days > 1) {
            return format(updateAt, "dd MMMM - HH:mm", {locale: ptBR})
        } else {
            return result
        }
    }



    return (
        <>
        <div className="flex justify-center w-full overflow-y-auto mb-4">
            <div className="flex flex-col w-full max-h-120">
                {
                    comments.length > 0 && (
                        comments.map((comment, i) => (
                            <div className="chat chat-start" key={i}>
                                
                                    {/* AVATAR IMAGE */}
                                    <div className="chat-image avatar">
                                        <div className="w-14 rounded-full">
                                            <img src={comment.user?.avatarImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                                        </div>
                                    </div>

                                    {/* NOME, DATA E HORA COMENTARIO */}
                                    <div className="chat-header flex w-full justify-end px-3">
                                        <div><time className="text-xs opacity-60" >{formatData(comment.updatedAt)}</time></div>
                                    </div>


                                    {/* COMENTARIO CHAT BUBBLE */}
                                    <div className="chat-bubble w-full max-w-full">
                                        {comment.text}
                                        
                                        
                                        {/* DIV DE ACOES NO CHAT BUBBLE */}
                                        <div className="flex justify-between w-full mt-1 ">
                                            <div className="my-auto opacity-60">
                                                {`${comment.user?.firstName} ${comment.user?.lastName}` }
                                            </div>

                                            <div className="flex justify-end">
                                                {
                                                    comment.user._id == session?.user?.id && (
                                                        <>
                                                        {/* botão de lapis para editar o comentário */}
                                                        <button className="btn btn-sm bg-transparent border-transparent" onClick={() => callCommentEdit(comment)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                            </svg>
                                                        </button>
                                                        
                                                        {/* botão de lixeira para excluir comentário */}
                                                        <button className="btn btn-sm bg-transparent border-transparent" onClick={() => deleteComment(comment._id)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                        </button>
                                                        </>
                                                    )
                                                }
                                                <div className="indicator">
                                                    {comment.likes.length > 0 && (
                                                        <span className="indicator-item badge badge-sm">{comment.likes.length}</span>
                                                    )}
                                                    {
                                                        comment.likes.length > 0 && comment.likes.find(like => like.user?._id == session?.user?.id) ? (
                                                            //botão like preenchido (usuário logado ja deu like nesse comentário)
                                                            <button className="btn btn-sm bg-transparent border-transparent" onClick={() => unLike(comment.likes.find(like => like.user?._id == session?.user?.id))} >
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                                                </svg>
                                                            </button>
                                                        ) : (
                                                            //botão de like vazio (usuário ainda não deu like nesse comentário)
                                                            <button className="btn btn-sm bg-transparent border-transparent" onClick={() => likeAdd(comment._id)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                                </svg>
                                                            </button>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    
                            </div>
                        ))
                    )
                }    
            </div>
        </div>
        
        </>
    )
}


