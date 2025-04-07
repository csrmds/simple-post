import React, { useState, useRef, useEffect } from "react"
import { useSession, signOut } from 'next-auth/react'
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"


export default function PostNew(props) {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [postImage, setPostImage] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [responseError, setResponseError] = useState(false)
    const [responseMsg, setResponseMsg] = useState('')
    const [responseData, setResponseData] = useState([])
    const { data: session } = useSession()
    const callRefreshPostList = props.getPostList
    const callUpdatePaginateOptions = props.updatePaginateOptions


    useEffect(()=> {
        //console.log("useEffect postNew refreshPostList: ", callRefreshPostList)
        //console.log("useEffect postNew refreshPostList: ", callRefreshPostList)
    }, [])
    
    //função para criar previews das imanges anexadas
    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files).map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }))) 
        console.log("\nArquivo setPostImage: ", selectedFiles)
        setPostImage(e.target.files)
    }

    //referencia do input do type="file" - verdadeiro botão de anexar (oculto)
    const inputFileHide = useRef(null)
    //função no botão visivel para chamar a função do botão oculto "inputFileHide"
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
            formPost.append('userAccountId', session?.user?.id)
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
                callUpdatePaginateOptions((e)=> e.preventDefault())
            }).finally(()=> {
                setTimeout(() => callRefreshPostList(), 1000)
                setTimeout(() => cleanPostForm(), 1000)
            }) 
                
            
            
        } catch (error) {
            setResponseError(true)
            setResponseMsg(error.message)
            console.error("Erro ao salvar o post...", error)
        }
    }

    const cleanPostForm = (e) => {
        e?.preventDefault()
        setTitle('')
        setContent('')
        setPostImage([])
        setSelectedFiles([])
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
            <div className="flex flex-col w-192">

                    <div className="card bg-base-200 w-full shadow-xl">
                        <form onSubmit={insertPost} method="POST" encType="multipart/form-data">
                            <div className="navbar rounded-t-xl flex justify-center
                                bg-gradient-to-br from-violet-700 from-10% to-violet-950 to-100%">
                                <strong>
                                    <input type="text" placeholder="Título do post" className="input input-ghost w-full max-w-xs text-center"
                                        value={title} onChange={(e) => setTitle(e.target.value)}
                                    />
                                </strong>
                            </div>
                            <div className="card-body">

                                <div className="card-actions">
                                    {selectedFiles?.length > 0 && (
                                        <div className="avatar-group -space-x-10 rtl:space-x-reverse">
                                            {selectedFiles?.map(({ file, preview }, i) => (
                                                <div key={i} className="avatar !rounded-3xl">
                                                    <div className="w-24">
                                                        <img src={preview} alt={file.name} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                <input type="text" placeholder="Algum comentário..." className="input input-ghost w-full"
                                    value={content} onChange={(e) => setContent(e.target.value)}
                                />

                                
                                
                                

                            </div>

                            <div className="card-actions justify-end p-4 mt-2 rounded-bl-2xl rounded-ee-2xl
                                bg-gradient-to-tr from-violet-700 from-10% to-violet-950 to-100%">
                                    <button className="btn btn-primary" onClick={handleButtonFile} >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                        </svg>
                                    </button>
                                    <input type="file" className="file-input file-input-secondary w-full max-w-xs" multiple
                                        ref={inputFileHide}
                                        style={{ display: "none" }}
                                        onChange={(e) => handleFileChange(e) } />
                                    <button className="btn btn-primary" onClick={(e)=> cleanPostForm(e)}>Cancelar</button>
                                    <button className="btn btn-success" onClick={insertPost}>Postar</button>
                                </div>
                        </form>
                    </div>

            </div>
        </div>
        
        </>
    )

}