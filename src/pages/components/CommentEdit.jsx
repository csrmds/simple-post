import { useEffect, useState } from "react"
import axios from "axios"


export default function commetnEdit(props) {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [comment, setComment] = useState(props.comment)
    const callRefreshComments = props.refreshComments
    const isVisible = props.isVisible


    useEffect(()=> {
        //console.log("useEffect CommentEdit\nProps.Comment: ", props.comment )
        //setText(comment.text || '')
        setComment(props.comment)
    },[props.comment])

    const updateComment = async() => {
        console.log("----updateComment----")
        setComment({...comment, text: text})
        console.log("comment antes do update: ", comment)
        try {
            const response = await axios.post(`${url}/comment/update`, {comment})
                .finally(setTimeout(()=> {
                    callRefreshComments(),
                    isVisible()
                }, 500))
            //console.log(response.data)
        } catch(err) {
            console.log("Erro ao atualizar o comentário: ", err)
        }
    }


    return (
        <>
        <div className="w-140">
            <label className="textarea flex flex-col items-center gap-2 p-0 bg-neutral">
                <textarea 
                    className="textarea text-sm/5 border-none focus:outline-none focus:ring-0 w-full bg-neutral"
                    rows="1" 
                    value={comment.text ?? ''}
                    onChange={(e)=> setComment({...comment, text: e.target.value})}
                /> 
                
                <div className="flex justify-end w-full px-4 mb-2">
                    <button className="btn btn-sm bg-transparent border-transparent" onClick={isVisible}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </button>  
                    
                    <button className="btn btn-sm bg-transparent border-transparent" onClick={updateComment}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </button>
                </div>
                
                


            </label>
            
        </div>
        </>
    )

}