import { useEffect, useRef, useState } from 'react'
import { Provider } from 'react-redux'
import { format, intervalToDuration, formatDistanceToNowStrict } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import axios from 'axios'
import mongoose from 'mongoose'
import path from 'path'
import Slider from 'react-slick'


export default function PostEdit(props) {
    const url= process.env.NEXT_PUBLIC_BACKEND_URL
    const [content, setContent] = useState("")
    const [images, setImages] = useState([])
    const [author, setAuthor] = useState("")
    const [uploadImages, setUploadImages] = useState([])
    const [selectedImages, setSelectedImages] = useState([])
    const [updatedAt, setUpdatedAt] = useState(Date())
    const callRefrehsPostList= props.refreshPostList

    const sliderSettins = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
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

    const updatePost = async (e) => {
        e.preventDefault()
        console.log("-----updatePost-----")


        try {
            const formUpdate= new FormData()
            const imagesData= new FormData()
            
            formUpdate.append('postId', props.postId)
            formUpdate.append('content', content)
            
            Array.from(uploadImages).forEach((file)=> {
                imagesData.append('post-image', file)
            })


            const response = await axios.post(`${url}/post/update`, formUpdate, 
                {headers: {'Content-Type': 'multipart/form-data'}}
            ).then((response)=> {
                console.log('UpdatePost response.data:')
                console.log(response.data)
                imagesData.append('postId', response.data._id)
                cloudinaryUpload(imagesData)
            })
            //console.log(response.data)
            document.getElementById('postEdit_'+props.postId).close()
            setTimeout(()=> callRefrehsPostList(), 1000)
            
        } catch(err) {
            console.error("Erro ao atualizar post.", err)
        }
    }


    const cloudinaryUpload = async (images) => {
        
        if (!images.has("postId") || !images.has('post-image')) return
        console.log("-----cloudinaryUpload-----")

        try {
            const response = await axios.post(`${url}/image/cloudinary/upload`, images, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
        

            if (response.data.length > 0 ) {
                console.log("entrou no if do response:", response.data, "length: ", response.data.length)
                const orderResponse= await axios.post(`${url}/image/lastOrder`, {postId: images.get("postId")})
                let order= orderResponse.data
                //console.log("cloudinaryUpload lastOrder:", order)

                for (const imageCloudi of response.data) {
                    console.log("entrou no laço...")
                    const image= {
                        postId: images.get("postId"),
                        address: imageCloudi.url,
                        source: "cloudinary",
                        public_id: imageCloudi.public_id,
                        description: imageCloudi.display_name,
                        order: order
                    }
                    order++

                    const resp= await axios.post(`${url}/image/insert`, image)
                    console.log("Imagem salva... ", resp.data)
                }

            } else {
                console.log("Nenhuma imagem foi enviada.", response)
            }
            
        } catch(err) {
            console.log("cloudinaryUpload error: ", err) 
        }
        
    }


    
    function formatData(dataMod) {
        const interval = intervalToDuration({ start: dataMod, end: Date.now() })
        const formatada = formatDistanceToNowStrict(dataMod, { addSuffix: true, locale: ptBR })
        if (interval.days > 1) {
            return format(dataMod, "dd MMMM - HH:mm", { locale: ptBR })
        } else {
            return formatada
        }
    }

    const getPost = async (postId) => {
        //console.log("-----getPost-----")
        //console.log("postId: ", postId)

        try {
            const response = await axios.post(`${url}/post/id/`, {postId: postId})
            setContent(response.data.content)
            setUpdatedAt(response.data.updatedAt)
            setAuthor(response.data.author)
            console.log("PostEdit response.data: ", response.data)
        } catch(err) {
            console.error("Erro ao buscar post por ID: ", err)
        }
    }



    const getPostImages = async () => {
        console.log("-----getPostImages-----")

        let postId= new mongoose.Types.ObjectId(props.postId)
        try {
            const response= await axios.post(`${url}/image/post`, {postId: postId})
            setImages(response.data)
        } catch(err) {
            console.error("Erro ao listar imanges do post.", err)
        }
    }


    const deleteImage = async (id) => {
        console.log("-----deleteImage-----")

        let imageId= new mongoose.Types.ObjectId(id)

        try {
            const response= await axios.post(`${url}/image/delete`, {imageId: imageId})
            console.log("resposta delete image:", response.data)
            setImages([])
            setTimeout(()=> getPostImages(), 200)
            
            document.getElementById('postEdit_'+props.postId).close()
            setTimeout(()=> callRefrehsPostList(), 1000)
        } catch(err) {
            console.error("Erro ao deletar imangem do post.", err)
        }
    }



    const cloudinaryTeste  = async () => {

        const response= await axios.post(`${url}/image/cloudinary/teste`, {postId: props.postId})

        console.log(response)
    }

    


    useEffect(()=> {
        getPost(props.postId)
        getPostImages()
    }, [])


    return (
        <>
            <div className='flex justify-between mb-2'>
                <div className="avatar">
                    <div className="w-12 rounded-full">
                        <img src={author?.avatarImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                    </div>
                </div>

                <div>
                    <button className='btn btn-sm btn-outline' onClick={cloudinaryTeste} >cloudinaryRenameTemp</button>
                </div>

                <div className='mr-6'>
                    {formatData(updatedAt) ?? ""}
                </div>
            </div>

            <div className='my-2 px-4'>
                {
                    
                    <Slider {...sliderSettins} className='max-h-104 mb-20'>
                        {
                            images.map((image, i)=> (
                                <div key={i}>
                                    <figure className='flex-none grid content-center max-h-104 mb-8'>
                                        <img
                                            src={
                                                image.source== "local" ? ( `${url}/images/${image.postId}/${path.basename(image.address)}`)
                                                : (image.address)
                                            }
                                            className='w-full h-auto max-h-104 object-contain'
                                        />

                                    </figure>
                                    <div className='flex justify-center gap-2'>
                                        <button className='btn btn-sm' onClick={()=> deleteImage(image._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                
                            ))
                        }

                    </Slider>
                    
                }
                
            </div>

            <div className='my-4'>
                <label className="textarea flex flex-col items-center gap-2 p-0 bg-neutral">
                    <textarea
                        className="textarea text-sm/5 border-none focus:outline-none focus:ring-0 w-full bg-neutral"
                        rows="1"
                        value={content ?? ''}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </label>
            </div>

            <hr />
            <form onSubmit={updatePost} method="POST" encType="multipart/form-data">
                <div className="modal-action mt-4 flex justify-between">
                        {/* Preview de fotos */}
                        <div className='flex w-1/4'>
                            {selectedImages?.length > 0 && (
                                <div className='avatar-group -space-x-10 rtl:space-x-reverse'>
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
                            style={{ display: "none" }}
                            ref={inputImageHide}
                            onChange={(e)=> handleImageChange(e)}
                        />

                        <div className='flex w-3/4 justify-end gap-2'>

                            <button className='btn btn-sm' onClick={addImageButton}>
                                <div className='indicator'>
                                    <span className="indicator-item ">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                        </svg>

                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                </div>
                            </button>

                            <button className="btn btn-sm" onClick={updatePost}>Atualizar</button>
                        </div>
                        
                    
                </div>
            </form>
        
        </>
    )
}