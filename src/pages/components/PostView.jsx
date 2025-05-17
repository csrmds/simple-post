import React from "react";
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useSession } from 'next-auth/react'
import path from 'path'
import { format, intervalToDuration, formatDistanceToNowStrict  } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import axios from 'axios'
import Slider from "react-slick";

import CommentNew from './CommentNew'
import CommentList from './CommentList'
import CommentEdit from './CommentEdit'
import PostEdit from "./PostEdit";



export default function PostView(props) {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const {data: session} = useSession()
    const [newCommentVisible, setNewCommentVisible]= useState(false)
    const [viewCommentList, setViewCommentList]= useState(false)
    const [editCommentVisible, setEditCommentVisible]= useState(false)
    const [images, setImages]= useState( props.images )
    const author = props.author
    const callRefreshPostList = props.refreshPostList
    const [commentEdit, setCommentEdit] = useState("")
    // const observerRef = useRef(null);
    // const [itemView, setItemView] = useState(false)

    const sliderSettins = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        //adaptiveHeight: true,
    }

    const dispatch = useDispatch()
    // const postCommentList = useSelector((state) => state.postCommentListReducer.currentCommentList)

    const likes = useSelector((state) => {
        const post = state.postListReducer.currentPostList.docs.find(post => post._id === props.postId)
        return post ? post.likes : []
    })

    const comments = useSelector((state) => {
        const post = state.postListReducer.currentPostList.docs.find(post => post._id === props.postId)
        return post ? post.comments : []
    })

    const callCommentEdit = (comment) => {
        setEditCommentVisible(true)
        setCommentEdit(comment)
    }

    useEffect(()=> {
        setImages([])
        setImages(props.images)

    }, [props.images])


    const refreshLikes = async () => {
        console.log("\n----RefreshLikes----\n")

        try {
            const response = await axios.post(`${url}/like/post`, {postId: props.postId})
            dispatch({
                type: 'postList/updatePostLikes',
                payload: {likes: response.data, postId: props.postId}
            })
        } catch (err) {
            console.error("\nErro ao buscar comentarios: ", err)
        }
    }

    const refreshComments= async ()=> {
        console.log("\n----RefreshComments----\n")
        const postId= props.postId
        try {
            const response = await axios.post(`${url}/comment`, {postId})
            dispatch({
                type: 'postList/updatePostComments',
                payload: { comments: response.data, postId }
            })
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
            await axios.post(`${url}/like/insert`, {like})
            refreshLikes()
        } catch (err) {
            console.log("\nErro ao inserir Like: ", err)
        }
    }

    const unLike = async (like) => {
        console.log("\n------unLike------\n")
        const likeId= like._id

        try {
            await axios.post(`${url}/like/remove`, {likeId})
            refreshLikes()
        } catch (err) {
            console.log("\nErro ao remover Like: ", err)
        }
    }


    const deletePost = async() => {
        console.log("deletePost request:")
        try {
            const response = await axios.post(`${url}/post/delete`, { postId: props.postId })
            console.log(response.data)
            setTimeout(()=> callRefreshPostList(), 1000)
        } catch(err) {
            console.log("erro ao deletar o post", err)
        }
    }


    function newComment() {
        setNewCommentVisible(!newCommentVisible)
    }

    function showCommentList() {
        setViewCommentList(!viewCommentList)
    }

    function showEditComment() {
        setEditCommentVisible(!editCommentVisible)
    }

    function formatData(updatedAt) {
        if (!updatedAt || isNaN(new Date(updatedAt))) return ''

        const interval = intervalToDuration({start: new Date(updatedAt), end: Date.now()})
        const formatada= formatDistanceToNowStrict(new Date(updatedAt), {addSuffix: true, locale: ptBR})
        if (interval.days > 1) {
            return format(new Date(updatedAt), "dd MMMM - HH:mm", {locale: ptBR})
        } else {
            return formatada
        }
    }

    


    return (
        <>
            
            <div className="flex justify-center w-full">
                
                {/* CARD DO POST */}
                <div className="card card-compact bg-base-100 shadow-xl w-96 sm:w-120 md:w-160">
                    
                    <div className="navbar bg-violet-800 rounded-t-xl flex justify-between px-6 ">
                        <div className="avatar">
                            <div className="w-16 rounded-full">
                                <img src={author?.avatarImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                            </div>
                            <h1 className="pl-2 font-semibold">{author?.firstName}</h1>
                        </div>
                        
                        <div className="flex-none">
                            {  formatData(props.updatedAt) }
                        </div> 
                    </div>
                    

                    
                        
                    {/* SLIDER DE FOTOS DO POST */}
                    { images?.length > 1 ? (
                        <>
                            <Slider {...sliderSettins} className=' '>
                                {
                                    images.map((image, i) => (
                                        <figure key={i} className='flex-none grid content-center'>
                                            <img
                                                src={
                                                    image.source== "local" ? ( url + "/images/"+ props.postId+"/"+ path.basename(image.address))
                                                    : ( image.address )
                                                }
                                                alt={image.description}
                                                className="w-full h-auto object-contain"
                                            />
                                        </figure>
                                    ))      
                                }
                            </Slider>
                        </>
                    ) : images?.length == 1 && (
                        <>
                            <figure className='flex-none grid content-center'>
                                <img
                                    src={
                                        images[0].source== "local" ? ( url + "/images/"+ props.postId+"/" + path.basename(images[0].address) )
                                        : ( images[0].address )
                                    }
                                    alt={images[0].description}
                                    className="w-full h-auto object-contain"
                                />
                            </figure>
                        </>
                    )}   
                    


                    {/* BODY E DESCRICAO DO POST */}
                    <div className="card-body">
                        <p className='my-2 text-lg'>{props.content}</p>
                        
                        
                        {/* ACTIONS DO POST, LIKES, COMMENTS */}
                        <div className="card-actions justify-between mt-2">
                            
                            <div className="flex w-3/4 gap-2">
                                    
                                {
                                    //BOTÃO DE LIKE
                                    likes?.length > 0 && likes.find(like => like.user?._id == session?.user?.id) ? (
                                        <div className='indicator'>
                                            <div className="indicator-item badge bg-violet-900 border-transparent badge-sm">{likes[0]?._id && likes?.length}</div>
                                            <button className="btn btn-sm border-transparent" onClick={()=> unLike(likes.find(like => like.user?._id == session?.user?.id))}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : likes?.length > 0 ? (
                                        <div className='indicator'>
                                            <div className="indicator-item badge bg-violet-900 border-transparent badge-sm">{likes[0]?._id && likes?.length}</div>
                                            <button className="btn btn-sm border-transparent" onClick={likeAdd}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="btn btn-sm border-transparent" onClick={likeAdd}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                            </svg>
                                        </button>
                                    )
                                }
                                
                                {
                                    //BOTÃO DE COMENTÁRIOS
                                    comments?.length > 0 ? (
                                        <div className='indicator'>
                                            <div className="indicator-item badge bg-violet-900 border-transparent badge-sm">{comments[0]?._id && comments?.length}</div>
                                            <button className="btn btn-sm border-transparent" onClick={showCommentList}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="btn btn-sm border-transparent" onClick={showCommentList}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                            </svg>
                                        </button>
                                    )
                                }
                                

                                <div className="indicator">
                                    <div className="indicator-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <button className="btn btn-sm border-transparent" onClick={newComment} >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                        </svg>
                                    </button>
                                </div>

                            </div>

                            {
                                author?._id == session?.user.id && (
                                    <div className="flex gap-2">
                                        <button className="btn btn-sm" onClick={() => document.getElementById(`postEdit_${props.postId}`).showModal()}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                            </svg>
                                        </button>

                                        <button className="btn btn-sm" onClick={deletePost}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>

                                        <dialog id={`postEdit_${props.postId}`} className="modal">
                                            <div className="modal-box max-w-3xl">
                                                <form method="dialog" className="modal-backdrop">
                                                    <button className="btn btn-sm btn-circle absolute right-2 top-4">✕</button>
                                                </form>
                                                <PostEdit postId={props.postId} refreshPostList={callRefreshPostList} ></PostEdit>
                                            </div>
                                        </dialog>
                                    </div>
                                )
                            } 
                            
                        </div>

                        
                        <div className={`transition-all duration-300 ease-in-out transform ${editCommentVisible ? "flex justify-center opacity-100 scale-100 max-h-40" : "flex justify-center opacity-0 scale-80 max-h-0"}`}>
                            <div className="flex justify-center">
                                <CommentEdit comment={commentEdit} refreshComments={refreshComments} isVisible={showEditComment} ></CommentEdit>
                            </div>
                        </div>

                        
                        <div className={`transition-all duration-300 ease-in-out transform ${newCommentVisible ? "flex justify-center opacity-100 scale-100 max-h-40" : "flex justify-center opacity-0 scale-80 max-h-0"}`}>
                            <div className=''>
                                <CommentNew postId={props.postId} cancelar={newComment} refreshComments={refreshComments} ></CommentNew>
                            </div>
                        </div>

                        <div className={`transition-all duration-300 ease-in-out transform ${viewCommentList ? "flex justify-center opacity-100 scale-100 max-h-192" : "flex justify-center opacity-0 scale-80 max-h-0"}`}>
                            <div className=''>
                                <CommentList 
                                    comments={comments} 
                                    postId={props.postId} 
                                    refreshComments={refreshComments}
                                    callCommentEdit={callCommentEdit}>
                                </CommentList>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            
            

            
        </>

    )
}