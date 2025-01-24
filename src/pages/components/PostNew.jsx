import React, { useState, useRef } from "react"
import axios from "axios"


export default function PostNew() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [postImage, setPostImage] = useState([])
    const [responseError, setResponseError] = useState(false)
    const [responseMsg, setResponseMsg] = useState('')
    const [responseData, setResponseData] = useState([])

    const inputFileHide = useRef(null)
    const handleButtonFile = (e) => {
        e.preventDefault()
        inputFileHide.current.click()
    }

    
    const insertPost = async(e) => {
        e.preventDefault()

        try {
            //ADICIONA CONTEUDO DO POST AO formPost
            const formPost= new FormData()
            formPost.append('title', title)
            formPost.append('content', content)
            Array.from(postImage).forEach((file)=> {
                formPost.append('post-image', file)
            })

            //ENVIA REQUISIÇÃO
            const response = await axios.post(`${url}/post/insert`, formPost, {
                headers: {'Content-Type': 'multipart/form-data'}
            }).then((response) => {
                console.log('then response..')
                console.log(response.data)
                setResponseError(response.data.error)
                setResponseData(response.data.postId)
                setResponseMsg(response.data.message)
            })     
            
        } catch (error) {
            setResponseError(true)
            setResponseMsg(error.message)
            console.error("Erro ao salvar o post...", error)
        }
    }

    const cleanPostForm = (e) => {
        e.preventDefault()
        setTitle('')
        setContent('')
        setPostImage([])
        setResponseError(false)
        setResponseData([])
        setResponseMsg(false)
    }

    const teste = (e) => {
        e.preventDefault()
        setResponseMsg(false)
    }



    return (
        <>
        <div className="flex justify-center mb-6">
            <div className="flex flex-col w-160">

                <div className="collapse bg-slate-800">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">Postar algo...</div>
                    <div className="collapse-content">
                        <div className="card w-full shadow-xl">
                            
                            <form onSubmit={insertPost} method="POST" encType="multipart/form-data">
                                <div className="card-body">
                                    <input type="text" placeholder="Título" className="card-title input w-full input-ghost" 
                                        value={title} onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <textarea className="textarea input-ghost" placeholder="Descrição..."
                                        value={content} onChange={(e) => setContent(e.target.value)}>
                                    </textarea>
                                    <div className="card-actions justify-end">
                                        <button className="btn btn-default" onClick={handleButtonFile}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                            </svg>
                                        </button>
                                        <input type="file" name="post-image" className="file-input file-input-ghost w-full max-w-xs" multiple
                                            ref={inputFileHide}
                                            style= {{ display: "none" }}
                                            onChange={ (e) => setPostImage(e.target.files) }
                                        />
                                        <button className="btn btn-default" onClick={cleanPostForm}>Cancelar</button>
                                        <button className="btn btn-primary" onClick={insertPost}>Postar</button>
                                        {/* <button className="btn btn-primary" onClick={teste}>teste</button> */}
                                    </div>

                                    {
                                        responseMsg && (
                                            <div role="alert" className={responseError ? "alert alert-error mt-2" : "alert alert-info mt-2"}>
                                                <span>{responseMsg}</span>
                                                <div className="flex justify-end w-full">
                                                    <button>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-6 w-6 shrink-0 stroke-current"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            onClick={teste}>
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    }        

                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                

            </div>
        </div>
        
        </>
    )

}