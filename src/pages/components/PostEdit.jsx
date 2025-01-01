import React, { useState } from "react"
import axios from "axios"


export default function PostEdit() {
    const url= process.env.NEXT_PUBLIC_BACKEND_URL
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [attachment, setAttachment] = useState([])

    const teste = () => {
        console.log('attachment: ', attachment)
    }

    const testeFile = async() => {
        const response= await axios.post(`${url}/post/teste`)

        console.log('response: ', response)
    }

    const insertPost = async(e) => {
        e.preventDefault()

        try {
            const formData = new FormData()
            
            formData.append('title', title)
            formData.append('content', content)
            Array.from(attachment).forEach((file)=> {
                //console.log('file array forEach: ', file)
                formData.append('post-image', file)
            })

            // console.log('Form data antes de enviar: ')
            // formData.forEach((value, key) => {
            //     console.log(`${key}: ${value}`)
            // })

            const response = await axios.post(`${url}/post/insert`, formData, {
                headers: {'Content-Type': 'multipart/form-data',}
            })

            console.log(response.data)
        } catch (error) {
            console.error("Erro ao acessar API: ", error)
        }
    }


    return (
        <>
        <div className="justify-center">
            <form onSubmit={insertPost} method="POST" encType="multipart/form-data">
                <div className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Título</span>
                    </div>
                    <input type="text" id="postTitle" placeholder="título post" className="input input-bordered w-full max-w-xs" required
                        value={title} onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Post</span>
                    </div>
                    <textarea className="textarea textarea-bordered w-full" id="postContent" placeholder="Seu comentário..."
                        value={content} onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                </div>

                <div className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text">Imagem</span>
                    </div>
                    <input type="file" name="post-image" className="file-input file-input-bordered w-full max-w-xs" multiple
                        onChange={ (e) => setAttachment(e.target.files) }
                    />    
                </div>

                <div>
                    <button className="btn btn-primary mx-2" onClick={insertPost}>Salvar</button>
                    <button className="btn btn-primary mx-2" onClick={testeFile} >Teste</button>
                </div>

            </form>

            <form action={`${url}/post/insert`} encType="multipart/form-data" method="post">
                    <div className="form-group my-4">
                        <input type="file" className="file-input file-input-bordered w-full max-w-xs" name="post-image" />
                        <input type="text" className="input input-bordered w-full max-w-xs" placeholder="Número de palestrantes" name="content" />
                        <input type="text" className="input input-bordered w-full max-w-xs" placeholder="Número de palestrantes" name="title" />
                        <input type="submit" value="Enviar anexo!" className="btn btn-default" />
                    </div>
            </form>

            
        </div>
        
        </>
    )
}