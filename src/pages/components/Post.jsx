import { useState } from 'react'
import Comment from './Comment'
import CommentEdit from './CommentEdit'
import BotaoTeste from './ButtonTest'


export default function post(props) {
    const [comment, setComment]= useState("")
    const [isVisible, setIsVisible]= useState(false)

    const handleComment= (newValue)=> {
        setComment(newValue)
    }

    function commentEdit() {
        console.log("commentEdit")
        if (isVisible) {
            setIsVisible(false)
        } else {
            setIsVisible(true)
        }
    }


    return (
        <>
            <div className="container lg">
                <div className="flex justify-center">
                    <div className="card card-compact bg-base-100 w-96 shadow-xl">
                        <div className="navbar bg-violet-200 rounded-t-xl flex justify-between">
                            <div className="avatar">
                                <div className="w-16 rounded-full">
                                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                                <h1 className="pl-2 font-semibold">Nome Usuário</h1>
                            </div>
                            
                            <div className="flex-none">
                                17/08/2024
                            </div>
                        </div>

                        <figure>
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                alt="Shoes" />
                        </figure>

                        <div className="card-body">
                            <h2 className="card-title">Shoes!</h2>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                            <div className="card-actions justify-start">
                                <button className="btn btn-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                </button>
                                <button className="btn btn-sm" onClick={commentEdit}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={isVisible ? "flex justify-center mt-4" : "hidden"}>
                    <div className='w-96'>
                        <CommentEdit cancelar={commentEdit} ></CommentEdit>
                    </div>
                </div>
                
                <div className='flex justify-center mt-4'>
                    <div className='w-96 rounded-lg'>
                        <Comment userName="Cesar Melo"></Comment>
                    </div>
                </div>


                <div className='flex justify-center mt-4'>
                    <div className='w-96 rounded-lg'>
                        <BotaoTeste></BotaoTeste>
                    </div>
                </div>
                
                
                
                
            </div>

            
        </>

    )
}