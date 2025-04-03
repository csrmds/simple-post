import { useEffect, useState } from "react"
import { useSession } from 'next-auth/react'
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"


export default function commentList(props) {
    const url= process.env.NEXT_PUBLIC_BACKEND_URL
    const {data: session} = useSession()
    const [postId, setPostId] = useState(props.postId)
    
    const comments = useSelector((state) => {
        const post = state.postListReducer.currentPostList.docs.find(post => post._id === postId)
        return post ? post.comments : []
    })
    //const testeComments= useSelector((state) => state.postListReducer.currentPostList.docs.map(post => post._id == postId && post.comments))

    const dispatch= useDispatch()
    const postList= useSelector((state)=> state.postListReducer.currentPostList)


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
            const response = await axios.post(`${url}/like/insert`, {like})
                .finally( setTimeout(() => refreshCommentById(commentId), 500) )
            // console.log("Like: ", like)
            // console.log("Response: ", response.data)
        } catch (err) {
            console.error("\nErro ao inserir Like: ", err)
        }
    }

    const unLike = async (like) => {
        console.log("\n------unLike------\n")
        
        try {
            const response = await axios.post(`${url}/like/remove`, {likeId: like._id})
                .finally(
                    setTimeout(() => refreshCommentById(like.foreignId), 500)
                )
            console.log("response unLike: ", response.data)
            console.log("Like param: ", like)
            //console.log(response.data)
        } catch (err) {
            console.error("\nErro ao remover Like: ", err)
        }
    }

    const refreshCommentById = async (commentId) => {
        console.log("\n----RefreshComment----\n")
        try {
            const response = await axios.post(`${url}/comment`, {commentId})
            console.log(response.data)
            dispatch({
                type: 'postList/updateCommentById',
                payload: {commentId, comment: response.data[0]}
            })
        } catch (err) {
            console.error("\nErro ao atualizar comentário: ", err)
        }
    }

    const refreshPostList = async (postId) => {
        console.log("\n----RefreshCommentsPostList----\n")
        console.log("Console comments: ", comments)
        // try {

        // } catch (err) {

        // }
    }


    const teste = (commentId)=> {
        console.log("commentId: ", commentId)
        //console.log("postlist: ", postList)
        const result = postList.docs.flatMap(post=> post.comments).find(comment => comment._id == commentId)
        console.log("comment: ", result)
        dispatch({
            type: 'postList/teste',
            payload: { commentId, comment: commentUpdate, testePayload, postCorrecao }
        })
    }



    return (
        <>
        <div className="flex justify-center overflow-y-auto mb-4">
            <div className="flex flex-col max-h-80 w-full">
                {
                    comments.length > 0 && (
                        comments.map((comment, i) => (
                            <div className="chat chat-start" key={i}>
                                
                                    <div className="chat-image avatar">
                                        <div className="w-14 rounded-full">
                                            <img src={comment.user?.avatarImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                                        </div>
                                    </div>
                                    <div className="chat-header">
                                        {comment.user?.firstName}
                                    </div>
                                    <div className="chat-bubble w-full max-w-full">
                                        {comment.text}
                                    </div>
                                    <div className="">
                                        
                                    </div>
                                    <div className="flex justify-end w-full mt-1 px-4">
                                        <button className="btn btn-sm" onClick={() => refreshCommentById(comment._id)}>commentCtrl</button>
                                        <button className="btn btn-sm" onClick={() => refreshPostList(postId)}>postCtrl</button>
                                        <div className="indicator">
                                            {comment.likes.length > 0 && (
                                                <span className="indicator-item badge badge-sm">{comment.likes.length}</span>
                                            )}
                                            {
                                                comment.likes.length > 0 && comment.likes.find(like => like.user?._id == session?.user?.id) ? (
                                                    <button className="btn btn-sm" onClick={() => unLike(comment.likes.find(like => like.user?._id== session?.user?.id))} >
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                                        </svg>
                                                    </button>
                                                ) : (
                                                    <button className="btn btn-sm" onClick={() => likeAdd(comment._id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                        </svg>
                                                    </button>
                                                )
                                            }
                                            
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


