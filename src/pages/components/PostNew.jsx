import React, { useState, useRef, useEffect } from "react"
import { useSession, signOut } from 'next-auth/react'
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"

export default function PostNew(props) {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [content, setContent] = useState('')
    const [selectedImages, setSelectedImages] = useState([])
    const [uploadImages, setUploadImages] = useState([])
    const [responseError, setResponseError] = useState(false)
    const [responseMsg, setResponseMsg] = useState('')
    const [responseData, setResponseData] = useState([])
    const { data: session, status } = useSession()
    const [user, setUser] = useState()
    const callRefreshPostList = props.getPostList
    const callUpdatePaginateOptions = props.updatePaginateOptions

    const [newPostCollapse, setNewPostCollapse] = useState(false)


    useEffect(()=> {
        if(session?.user) {
            const userJson= JSON.parse(JSON.stringify(session?.user))
            if (status== "authenticated") setUser(userJson)
        }
    }, [])


    const insertPost = async(e) => {
        e.preventDefault()

        try {
            //ADICIONA CONTEUDO DO POST AO formPost
            const formPost= new FormData()
            const imagesData= new FormData()

            formPost.append('content', content)
            formPost.append('userAccountId', session?.user?.id)

            Array.from(uploadImages).forEach((file)=> {
                imagesData.append('post-image', file)
            })

            //ENVIA REQUISIÇÃO
            const response = await axios.post(`${url}/post/insert`, formPost, {
                headers: {'Content-Type': 'multipart/form-data'}
            }).then((response) => {
                console.log('InserPost response PostId:')
                console.log(response.data.postId)
                //const postId= String(response.data._id) 
                imagesData.append('postId', response.data.postId)
                cloudinaryUpload(imagesData)
                setResponseError(response.data.error)
                setResponseData(response.data.postId)
                setResponseMsg(response.data.message)
                callUpdatePaginateOptions((e)=> e.preventDefault())
            }).finally(()=> {
                setTimeout(() => callRefreshPostList(), 1000)
                setTimeout(() => cleanPostForm(), 1000)
            }) 

        } catch(err) {
            setResponseError(true)
            setResponseMsg(err.message)
            console.error("Erro ao salvar o post...", err)
        }
    }

    const cloudinaryUpload = async (images) => {
        
        if (!images.has("postId") || !images.has('post-image')) return
        
        try {
            const response = await axios.post(`${url}/image/upload`, images, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
        

            if (response.data.length > 0 ) {
                let i=0
                for (const imageCloudi of response.data) {
                    console.log("entrou no laço...")
                    const image= {
                        postId: images.get("postId"),
                        address: imageCloudi.url,
                        source: "cloudinary",
                        public_id: imageCloudi.public_id,
                        url: imageCloudi.url,
                        description: imageCloudi.display_name,
                        order: i
                    }
                    i++

                    const resp= await axios.post(`${url}/image/insert`, image)
                    console.log("Imagem salva... ", resp.data)
                }

            }
            
        } catch(err) {
            console.log("cloudinaryUpload error: ", err) 
        }
        
    }

    const cleanPostForm = (e) => {
        e?.preventDefault()
        setContent('')
        setUploadImages([])
        setSelectedImages([])
        setResponseError(false)
        setResponseMsg(false)
        setNewPostCollapse(false)
    }

    //referencia do input do type="file" - verdadeiro botão de anexar (oculto)
    const inputImageHide= useRef(null)
    //função no botão visivel para chamar a função do botão oculto "inputFileHide"
    const addImageButton = (e) => {
        e.preventDefault()
        console.log("-----addImage-----")
        inputImageHide.current.click()
    }

    //função para criar preview das fotos
    const handleImageChange = (e) => {
        setSelectedImages(Array.from(e.target.files).map(file => ({
            file,
            preview: URL.createObjectURL(file)
        })))
        //console.log("Imagem setPostImage: ", selectedImages)
        setUploadImages(e.target.files)
        
    }


    
    function teste01() {
        let elem= document.getElementById("collapseCheckBox")
        console.log(elem.checked)
    }




    return (
        <>
            <div className="collapse bg-base-200" >
                
                <input type="checkbox" id="collapseCheckBox" checked={newPostCollapse} />
                
                <div className="collapse-title text-lg font-medium flex align-middle">
                        
                    <div className="avatar mr-4">
                        <div className="w-16 rounded-full">
                            <img src={user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                        </div>
                    </div>

                    <div className="flex w-full mb-2" >
                        <input type="text" placeholder="Seu post aqui..." 
                            className="input input-bordered w-full z-10" 
                            onFocus={()=> setNewPostCollapse(true)} 
                            value={content}
                            onChange={(e)=> setContent(e.target.value)}  />
                    </div>
                    
                </div>


                <div className="collapse-content">
                <form onSubmit={insertPost} method="POST" encType="multipart/form-data">
                    {/* Preview de fotos */}
                    <div className='flex w-1/2'>
                        {selectedImages?.length > 0 && (
                            <div className='avatar-group -space-x-5 rtl:space-x-reverse'>
                                {selectedImages?.map(({image, preview}, i) => (
                                    <div key={i} className='avatar !rounded-xl'>
                                        <div className='w-16'>
                                            <img src={preview} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input oculto com ação de anexar arquivos */}
                    <input type="file" className='file-input input-sm' multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={inputImageHide}
                        onChange={(e)=> handleImageChange(e)}
                    />

                    {/* Botões de ações */}
                    <div className="flex justify-end py-2 gap-2">
                        <button className="btn btn-md btn-outline" onClick={cleanPostForm}>
                            Cancelar
                        </button>
                        <button className="btn btn-md btn-success" onClick={addImageButton}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </button>
                        <button className="btn btn-md btn-success" onClick={insertPost}>
                            Postar
                        </button>
                    </div>
                    </form>
                </div>
                

                

            </div>
        
        </>
    )

}