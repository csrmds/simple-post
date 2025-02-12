import { useEffect, useState } from "react"


export default function commentList(props) {
    const url= process.env.NEXT_PUBLIC_BACKEND_URL
    const [comments, setComments] = useState(props.comments)

    useEffect(()=> {
        console.log("comment list component useEffect: ")
        console.log(comments[0].author[0])
    }, [])

    const teste = () => {
        console.log("botao teste: ", comments)
    }

    return (
        <>
            <div className="flex justify-center overflow-y-auto pt-5">
                <div className="flex flex-col max-h-80">
                {
                    comments.length > 0 ? (
                        comments.map((comment, i) => (
                            <div className="indicator my-1" key={i}>
                                <span className="indicator-item indicator-middle indicator-start badge">
                                    <img
                                        className="h-12 w-12 rounded-full"
                                        alt="Tailwind CSS examples"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </span>
                                <div className="card border w-120">
                                    <div className="card-body p-4 ">
                                        <p className="pl-4">{comment.text}</p>
                                    </div>
                                    <div className="card-actions justify-end pr-4 pb-2">
                                        <p className="pl-8">Autor: {comment.author[0]?.firstName}</p>
                                        <button className="btn btn-sm" onClick={teste} >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                            </svg>
                                        </button>
                                        <button className="btn btn-sm" >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                            </svg>
                                        </button>
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