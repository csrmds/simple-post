import { useEffect, useState } from "react"
import axios from "axios"


export default function CommentEdit(props) {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [comment, setComment] = useState(props.comment)
    const callRefreshComments = props.refreshComments
    const isVisible = props.isVisible


    useEffect(()=> {
        //console.log("useEffect CommentEdit\nProps.Comment: ", props.comment )
        setComment(props.comment)
    },[props.comment])

    const updateComment = async() => {
        console.log("----updateComment----")

        try {
            await axios.post(`${url}/comment/update`, {comment})    
            callRefreshComments()
            isVisible()                
            //console.log(response.data)
        } catch(err) {
            console.log("Erro ao atualizar o comentário: ", err)
        }
    }


    return (
        <>
        
            <label className="textarea flex flex-col items-center w-full gap-2 p-0 bg-neutral">
                <textarea 
                    className="textarea text-sm/5 border-none focus:outline-none focus:ring-0 w-full bg-neutral"
                    rows="1" 
                    value={comment?.text ?? ''}
                    onChange={(e)=> setComment({...comment, text: e.target.value})}
                /> 
                
                {/* DIV DE ACOES NO TEXTAREA */}
                <div className="flex justify-between w-full px-4 mb-2 gap-2">
                    <div className="my-auto">
                        <div className="avatar">
                            <div className="w-8 rounded-full mr-2">
                                <img src={comment.user?.avatarImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                            </div>
                            <span className="opacity-60">Editando...</span>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <button className="btn btn-sm btn-outline btn-error" onClick={isVisible}>Cancelar</button>  
                        <button className="btn btn-sm btn-outline" onClick={updateComment}>Salvar</button>
                    </div>
                    
                </div>

            </label>
            
        
        </>
    )

}