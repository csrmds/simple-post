import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import CommentEdit from './CommentEdit'
import CommentList from './CommentList'
import path from 'path'
import {format, compareAsc} from 'date-fns'
import axios from 'axios'



export default function postView(props) {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const {data: session} = useSession()
    const [comments, setComments]= useState(props.comments)
    const [newCommentVisible, setNewCommentVisible]= useState(false)
    const [viewCommentList, setViewCommentList]= useState(false)
    const [images, setImages]= useState( props.images )


    useEffect(()=> {
        //console.log("props Likes: ", props.likes, "\nnº: ", props.likes.length)
    }, [])

    const refreshComments= async ()=> {
        console.log("\n----RefreshComments----\n", props.postId)
        const postId= props.postId
        try {
            const response = await axios.post(`${url}/comment`, {postId})
            setComments(response.data)
            console.log("getCommentsByPostId: ", response.data)
        } catch (err) {
            console.log("\nErro ao buscar comentarios: ", err)
        }
    }

    const likeAdd = async () => {
        console.log("\n------Like Add------\n")
        const like= {
            from: "post",
            foreignId: props.postId,
            userAccountId: session?.user?.id
        }

        try {
            console.log("\ntry/catch - like: ", like)
            const response = await axios.post(`${url}/like/insert`, {like})

            console.log(response)
        } catch (err) {
            console.log("\nErro ao inser Like: ", err)
        }
    }

    const teste= ()=> {
        console.log("Sessão.user: ", session?.user)
    }

    function newComment() {
        if (newCommentVisible) {
            setNewCommentVisible(false)
        } else {
            setNewCommentVisible(true)
        }
    }

    function showCommentList() {
        viewCommentList ? setViewCommentList(false) : setViewCommentList(true)
        //console.log("viewcommentList: ", viewCommentList)
    }

    


    return (
        <>
            
            <div className="flex justify-center">
                <div className="card card-compact bg-base-100 w-160 shadow-xl">
                    <div className="navbar bg-violet-800 rounded-t-xl flex justify-between">
                        <div className="avatar">
                            <div className="w-16 rounded-full">
                                <img src={props.author?.avatarImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                            </div>
                            <h1 className="pl-2 font-semibold">{props.author?.firstName}</h1>
                        </div>
                        
                        <div className="flex-none">
                            { format(props.createdAt, "dd/MM/yyyy - HH:mm")  }
                        </div>
                    </div>

                    <figure className='bg-slate-800'>
                        <div className='carousel carousel-center max-h-144'>
                            { props.images.length > 0 ? (
                                props.images.map((image, i) => (
                                    <div className='carousel-item w-full flex justify-center' key={i} id={`${image.postId}_${i}`} >
                                        <img src={url+"/images/"+path.basename(image.address)} alt={image.description} />
                                        {/* <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                                            <a href={`#${image.postId}_${i-1}`} className="btn btn-circle">❮</a>
                                            <a href={`#${image.postId}_${i+1}`} className="btn btn-circle">❯</a>
                                        </div> */}
                                    </div>
                                )) 
                            ) : ( <p>Post sem imagem...</p> ) }
                        </div>
                    </figure>

                    <div className="card-body">
                        <h2 className="card-title">{ props.title }</h2>
                        <p className='mb-2'>{props.content}</p>
                        <div className="card-actions justify-start">
                            
                            <div className='indicator'>
                                <div className="indicator-item badge badge-default badge-sm">{props.likes.length}</div>
                                <button className="btn btn-sm" onClick={likeAdd}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className='indicator'>
                                <div className="indicator-item badge badge-default badge-sm">{props.comments.length}</div>
                                <button className="btn btn-sm" onClick={showCommentList}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                </button>
                            </div>

                            <div className='indicator'>
                                <div className="indicator-item badge badge-secondary badge-sm">new</div>
                                <button className="btn btn-sm" onClick={newComment}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                </button>
                            </div>
                            
                            
                        </div>
                        
                        <div className={`transition-all duration-300 ease-in-out transform ${newCommentVisible ? "flex justify-center mt-4 opacity-100 scale-100 max-h-40" : "flex justify-center mt-4 opacity-0 scale-80 max-h-0"}`}>
                            <div className='w-120'>
                                <CommentEdit postId={props.postId} cancelar={newComment} refreshComments={refreshComments} ></CommentEdit>
                            </div>
                        </div>

                        <div className={`transition-all duration-300 ease-in-out transform ${viewCommentList ? "flex justify-center mt-4 opacity-100 scale-100 max-h-192" : "flex justify-center mt-4 opacity-0 scale-80 max-h-0"}`}>
                            <div className='w-140'>
                                <CommentList comments={comments}></CommentList>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            
            

            
        </>

    )
}