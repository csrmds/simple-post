import { useEffect, useState } from "react"
import axios from "axios"


export default function CommentEdit(props) {
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
        //setComment({...comment, text: text})
        console.log("comment antes do update: ", comment)
        try {
            await axios.post(`${url}/comment/update`, {comment})
                .finally(setTimeout(()=> {
                    callRefreshComments(),
                    isVisible()
                }, 0))
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
                
                <div className="flex justify-end w-full px-4 mb-2 gap-2">
                    <button className="btn btn-sm btn-outline btn-error" onClick={isVisible}>Cancelar</button>  
                    
                    <button className="btn btn-sm btn-outline" onClick={updateComment}>Salvar</button>
                </div>

            </label>
            
        </div>
        </>
    )

}