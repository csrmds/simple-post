import { useEffect, useState } from "react"
import { useSession } from 'next-auth/react'
import axios from "axios"

export default function commentNew(props) {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const {data: session} = useSession()
    const foreignId = props.postId
    const type = "post"
    const userAccountId = session.user?.id
    const responseId = props.commentId
    const [text, setText] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [errorVisible, setErrorVisible] = useState("")
    const [infoMessage, setInfoMessage] = useState("")
    const [infoVisible, setInfoVisible] = useState(false)
    const callRefreshComments= props.refreshComments
    
    
    useEffect(()=> {
        
    })

    function cleanFields() {
        setText("")
        setTimeout(() => {
            props.cancelar(false)    
        }, 2000);
    }


    const saveComment= async()=> {

        try {
            const response = await axios.post(`${url}/comment/insert`, {foreignId, text, type, responseId, userAccountId})
            console.log(response.data)
            setInfoMessage("Comentario salvo com sucesso!")
            setInfoVisible(true)
            setTimeout(() => setInfoVisible(false), 2000);
            cleanFields()
            setTimeout(() => callRefreshComments(), 1000)
        } catch (error) {
            console.log("Erro ao tentar salvar o comentario", error)
            setErrorMessage(error)
            setErrorVisible(true)
        }
    }

    return (
        <>
            <div>
                <textarea 
                    className="textarea bg-slate-800 text-sm/5 w-full py-1 px-4" 
                    placeholder="Seu comentário..."
                    onChange={(e)=> setText(e.target.value)} 
                    value={text} 
                />
            </div>
            
            <div className="flex justify-evenly mt-1">
                <button className="btn btn-sm btn-outline" onClick={saveComment}>Comentar</button>
                <button className="btn btn-sm btn-outline btn-error" onClick={()=> props.cancelar(false)} >Cancelar</button>
                {/* <button className="btn btn-sm btn-outline" onClick={()=> setText("")}>teste</button> */}
            </div>

            <div className={`transition-all duration-300 ease-in-out transform ${errorVisible ? "opacity-100 scale-100 max-h-40 my-2" : "opacity-0 scale-95 max-h-0 my-2"}`}>
                <div className="alert alert-error" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errorMessage}</span>
                </div>
            </div>

            <div className={`transition-all duration-300 ease-in-out transform ${infoVisible ? "opacity-100 scale-100 max-h-40 my-2" : "opacity-0 scale-95 max-h-0 my-2"}`}>
                <div className="alert alert-info" role="alert">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{infoMessage}</span>
                </div>
            </div>
            
            
            

        </>
    )
}