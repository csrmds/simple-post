import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useSession } from 'next-auth/react'
import path from 'path'
import { format, intervalToDuration, formatDistanceToNowStrict  } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import axios from 'axios'
import Slider from "react-slick";



export default function PostViewNew(props) {const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const {data: session} = useSession()
    const [images, setImages]= useState( props.images )
    const author = props.author
    const callRefreshPostList = props.refreshPostList
    const [commentEdit, setCommentEdit] = useState("")
    const [newCommentVisible, setNewCommentVisible]= useState(false)
    const [viewCommentList, setViewCommentList]= useState(false)
    const [editCommentVisible, setEditCommentVisible]= useState(false)

    const sliderSettins = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        //adaptiveHeight: true,
    }

    const dispatch = useDispatch()

    useEffect(()=> {
        setImages([])
        setImages(props.images)

    }, [props.images])


    function formatData(updatedAt) {
        if (!updatedAt || isNaN(new Date(updatedAt))) return ''

        const interval = intervalToDuration({ start: new Date(updatedAt), end: Date.now() })
        const formatada = formatDistanceToNowStrict(new Date(updatedAt), { addSuffix: true, locale: ptBR })
        if (interval.days > 1) {
            return format(new Date(updatedAt), "dd MMMM - HH:mm", { locale: ptBR })
        } else {
            return formatada
        }
    }


    return (
        <>
            <div className="flex justify-center w-full" name={props.name}>
                
                <div className="card card-compact bg-base-100 shadow-xl w-full xl:w-160">
                    
                    {/* NAVBAR DO POST */}
                    <div className="navbar bg-orange-800 rounded-t-xl justify-between px-6">
                        
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


                    {/* SLIDER DE FOTOS AQUI */}
                    {
                        images?.length >= 1 && (
                            <>
                                <figure className='flex-none grid content-center'>
                                    <img
                                        src={
                                            images[0].source == "local" ? (url + "/images/" + props.postId + "/" + path.basename(images[0].address))
                                                : (images[0].address)
                                        }
                                        alt={images[0].description}
                                        className="w-full h-auto object-contain"
                                    />
                                </figure>
                            </>
                        )
                    }





                    {/* BODY E DESCRICAO DO POST */}
                    <div className="card-body">
                        <p className="my-2 text-lg">aqui o comentário do post....</p>


                        {/* RODAPÉ COM BOTÕES DE AÇÕES DO POST */}
                        <div className="card-actions justify-between mt-2">

                            <div className="flex w-3/4 gap-2">
                                <button className="btn btn-sm border-transparent">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                    </svg>
                                </button>

                                <button className="btn btn-sm border-transparent">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                </button>

                                <button className="btn btn-sm border-transparent" >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                </button>
                            </div>

                        </div>
                    </div>


                    





                </div>
            </div>
        </>
    )
}