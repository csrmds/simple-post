import { useState } from "react"
import axios from "axios"

export default function commentEdit(props) {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [postId, setPostId] = useState(props.postId)
    const [text, setText] = useState(props.text)
    const [type, setType] = useState("post")
    const [responseId, setResponseId] = useState(props.commentId)


    const saveComment= async()=> {
        //e.preventDefault()

        try {
            const response = await axios.post(`${url}/comment/insert`, {postId, text, type, responseId})
            console.log(response.data)
        } catch (error) {
            console.log("Erro ao tentar salvar o comentario", error)
        }
    }

    return (
        <>
            <div>
                <textarea className="textarea textarea-bordered w-full" placeholder="Seu comentário..."
                    onChange={e=> setText(e.target.value)}>
                    {text}
                </textarea>
            </div>
            
            <div className="flex justify-evenly">
                <button className="btn btn-sm btn-outline" onClick={saveComment}>Comentar</button>
                <button className="btn btn-sm btn-outline btn-error" onClick={()=> props.cancelar(false)} >Cancelar</button>
            </div>
        </>
    )
}