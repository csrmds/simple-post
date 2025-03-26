import React from "react";
import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Slider from "react-slick";
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
    const [likes, setLikes]= useState( props.likes )
    const [liked, setLiked] = useState()
    const author = props.author
    const callRefreshPostList = props.refreshPostList
    const observerRef = useRef(null);
    const [itemView, setItemView] = useState(false)

    const sliderSettins = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        //adaptiveHeight: true,
        //centerMode: true,
        //centerPadding: '50px'
    }


    useEffect(()=> {
        checkLike()
        setComments(props.comments)
        //console.log("useEffect images: ", images)
        // console.log("lenght: ", images.length)
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setTimeout(()=> setItemView(true), 1000)
                }
            },
            { threshold: 1.0 }
        )

        if (observerRef.current) {
            observer.observe(observerRef.current)
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current)
            }
        }
    }, [])

    const refreshLikes= async ()=> {
        console.log("\n----RefreshLikes----\n")
        try {
            const response = await axios.post(`${url}/like/post`, { postId: props.postId})
            setLikes(response.data)
            checkLike()
            //console.log("Likes: ", likes)
        } catch (err) {
            console.log("\nErro ao buscar comentarios: ", err)
        }
    }

    const refreshComments= async ()=> {
        console.log("\n----RefreshComments----\n", props.postId)
        const postId= props.postId
        try {
            const response = await axios.post(`${url}/comment`, {postId})
            console.log("getCommentsByPostId: ", response.data)
            setComments(response.data)
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
            refreshLikes()
        } catch (err) {
            console.log("\nErro ao inserir Like: ", err)
        }
    }

    const unLike = async () => {
        console.log("\n------unLike------\n")
        const likeId= liked._id

        try {
            const response = await axios.post(`${url}/like/remove`, {likeId})
            console.log(response.data)
            refreshLikes()
        } catch (err) {
            console.log("\nErro ao remover Like: ", err)
        }
    }

    const checkLike = async () => {
        //console.log("\n------checkLike------\n")
        const like= {
            from: "post",
            foreignId: props.postId,
            userAccountId: session?.user?.id
        }

        try {
            //const response = await likes.find(check => check.from== "post" && check.foreignId== props.postId && check.userAccountId== session?.user?.id )
            const response = await axios.post(`${url}/like/check`, {like})
            //console.log("check response: ",response)
            setLiked(response.data)
        } catch (err) {
            console.log("Erro ao verificar o like: ", err)
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
    }

    


    return (
        <>
            
            <div className="flex justify-center">
                <div className="card card-compact bg-base-100 w-160 shadow-xl">
                    <div className="navbar bg-violet-800 rounded-t-xl flex justify-between px-6 shadow-xl shadow-black">
                        <div className="avatar">
                            <div className="w-16 rounded-full">
                                <img src={author?.avatarImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                            </div>
                            <h1 className="pl-2 font-semibold">{author?.firstName}</h1>
                        </div>

                        <h2 className="card-title">{ props.title }</h2>
                        
                        <div className="flex-none">
                            { format(props.createdAt, "dd/MM/yy - HH:mm")  }
                        </div>
                    </div>

                    
                        
                    
                    { images.length > 1 ? (
                        <>
                            <Slider {...sliderSettins} className='bg-slate-700 max-h-160'>
                                {
                                    images.map((image, i) => (
                                        <figure key={i} className='flex-none grid content-center max-h-160'>
                                            <img
                                                src={
                                                    image.source== "local" ? ( url + "/images/" + path.basename(image.address))
                                                    : ( image.address )
                                                }
                                                alt={image.description}
                                                className="w-full h-auto max-h-160 object-contain"
                                            />
                                        </figure>
                                    ))      
                                }
                            </Slider>
                        </>
                    ) : images.length == 1 && (
                        <>
                            <figure className='flex-none grid content-center max-h-160 bg-slate-800'>
                                <img
                                    src={
                                        images[0].source== "local" ? ( url + "/images/" + path.basename(images[0].address) )
                                        : ( images[0].address )
                                    }
                                    alt={images[0].description}
                                    className="w-full h-auto max-h-160 object-contain"
                                />
                            </figure>
                        </>
                    )}   
                    
                    <div className="card-body">
                        <p className='my-2'>{props.content}</p>
                        <div className="card-actions justify-between">
                            <div>
                                <div className='indicator'>
                                    <div className="indicator-item badge badge-default badge-sm">{likes[0]?._id && likes.length}</div>
                                    {
                                        liked != null ? (
                                            <button className="btn btn-sm" onClick={unLike}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                                </svg>
                                            </button>
                                        ) : (
                                            <button className="btn btn-sm" onClick={likeAdd}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                </svg>
                                            </button>
                                        )
                                    }
                                </div>
                                
                                <div className='indicator'>
                                    <div className="indicator-item badge badge-default badge-sm">{comments[0]?._id && comments.length}</div>
                                    <button className="btn btn-sm" onClick={showCommentList}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                        </svg>
                                    </button>
                                </div>

                                
                                <button className="btn btn-sm" onClick={newComment} >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                </button>

                                <button className="btn btn-sm" ref={observerRef}>
                                    {
                                        itemView ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        )
                                    }
                                    
                                </button>
                            </div>

                            {
                                author?._id == session?.user.id && (
                                    <div>
                                        <button className="btn btn-sm" onClick={deletePost}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                )
                            } 
                            

                            {/* <button className="btn btn-sm" onClick={checkLike}>CheckLike</button> */}
                            
                            
                            
                        </div>
                        
                        <div className={`transition-all duration-300 ease-in-out transform ${newCommentVisible ? "flex justify-center mt-4 opacity-100 scale-100 max-h-40" : "flex justify-center opacity-0 scale-80 max-h-0"}`}>
                            <div className='w-120'>
                                <CommentEdit postId={props.postId} cancelar={newComment} refreshComments={refreshComments} ></CommentEdit>
                            </div>
                        </div>

                        <div className={`transition-all duration-300 ease-in-out transform ${viewCommentList ? "flex justify-center mt-4 opacity-100 scale-100 max-h-192" : "flex justify-center opacity-0 scale-80 max-h-0"}`}>
                            <div className='w-140'>
                                <CommentList comments={comments} refreshComments={refreshComments}></CommentList>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            
            

            
        </>

    )
}