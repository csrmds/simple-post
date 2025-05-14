import { useState } from 'react'
import { Provider } from 'react-redux'
import store from '../redux/store'
import { format, intervalToDuration, formatDistanceToNowStrict } from 'date-fns'
import { ptBR, tr } from 'date-fns/locale'
import axios from 'axios'

import Body from './components/layout/Body'
import PostList from './components/PostList'
import PostListRedux from './components/PostListRedux'
import UserAdmin from './components/UserList'
import PostEdit from './components/PostEdit'


import Slider from "react-slick";
import { list } from 'postcss'



export default function admin(props) {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [content, setContent] = useState(props.content)
    const [postImage, setPostImage] = useState(props.images)
    const [selectedFiles, setSelectedFiles] = useState([])
    const [cloudiImages, setcloudiImages] = useState([])
    const [postId, setPostId] = useState('680ebb822d50e8e01b9d9629')
    const [listImages, setListImages] = useState([])
    const [imageCloudi, setImageCloudi] = useState('')
    const [cloudiId, setCloudiId] = useState('')

    const sliderSettins = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        //adaptiveHeight: true,
        //centerMode: true,
        //centerPadding: '50px'
    }


    const getPostImages = async () => {
        console.log('-----getPostImages-----')

        try {
            const response= await axios.post(`${url}/image/cloudinary/listByPostId`, {postId: postId})

            console.log("Response:")
            console.log(response.data)
            setListImages(response.data.resources)
        } catch(err) {
            console.error("Error: ", err)
        }

    }

    const getImageCloudi = async () => {
        console.log('-----getImageCloudi-----')

        try {
            const response= await axios.post(`${url}/image/cloudinary/getImageByPublicId`, {publicId: cloudiId})

            console.log("Response:")
            console.log(response.data)
            setListImages(response.data.resources)
        } catch(err) {
            console.error("Error: ", err)
        }
    }

    const deleteImage = async (publicId) => {
        console.log('-----deleteImages-----')
        console.log("publicID: ", publicId)

        try {
            const response= await axios.post(`${url}/image/cloudinary/delete`, {publicId: publicId})

            console.log("Response:")
            console.log(response.data)
        } catch(err) {
            console.error("Error: ", err)
        }
    }

    const renameReorderImages = async () => {
        console.log('-----deleteImages-----')
        console.log("postId: ", postId)

        try {
            const response = await axios.post(`${url}/image/cloudinary/reorder`, {postId: postdId})

            console.log("Response:")
            console.log(response.data)
        } catch(err) {
            console.error("Error: ", err)
        }
    }

    const teste = async ()=> {
        console.log("-----renameTeste-----")
        console.log("postId: ", postId)

        try {
            const response= await axios.post(`${url}/image/cloudinary/teste`, {postId: postId})

            console.log("Response:")
            console.log(response.data)
            setListImages(response.data.resources)
        } catch(err) {
            console.error("Error: ", err)
            setListImages([])
        }
    }

    const lastImageOrder = async () => {
        console.log("-----lastImageOrder-----")
        console.log("postId: ", postId)

        try {
            const response= await axios.post(`${url}/image/cloudinary/teste2`, {postId: postId})

            console.log("Response imageOrder:")
            console.log(response.data)
            
        } catch(err) {
            console.error("Error: ", err)
        }
    }

    const handleFileCloudi = (e) => {
        setSelectedFiles(e.target.files)
    }
    
    const uploadImages = async () => {
        const images= new FormData()
        Array.from(selectedFiles).forEach((file)=> {
            console.log(file)
            images.append('file', file)
            //images.append('upload_preset', 'my_upload_unsigned')
        })

        const response = await axios.post('http://localhost:5000/image/upload', images, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(response => console.log("response: ", response))

        //console.log("response: ", response)
    }


    function formatData(updatedAt) {
        const interval = intervalToDuration({ start: updatedAt, end: Date.now() })
        const formatada = formatDistanceToNowStrict(updatedAt, { addSuffix: true, locale: ptBR })
        if (interval.days > 1) {
            return format(updatedAt, "dd MMMM - HH:mm:ss", { locale: ptBR })
        } else {
            return formatada
        }
    }


    return (
        <>
            <Provider store={store}>
                <Body titulo="Admin page">

                <div className='h-160 bg-amber-800'>
                    <figure className='flex-none grid w-192 h-160 bg-slate-500 content-center'>
                        <img src="http://res.cloudinary.com/dufaejhwh/image/upload/v1747191069/68240519d12ab53c66dcd79d_3.jpg" className=' '>

                        </img>
                    </figure>
                </div>
                



                    {/*                     
                    <div className='flex gap-2 mb-4'>
                        <input type="text" className='input input-secondary' placeholder='postId aqui...' onChange={(e)=> setPostId(e.target.value) } value={postId} />
                        <button className='btn btn-accent' onClick={teste} >Teste</button>
                        <button className='btn btn-accent' onClick={lastImageOrder} >LastImageOrder</button>
                        <button className='btn btn-accent' onClick={getImageCloudi} >PublicId</button>
                        <input type="text" className='input input-bordered input-warning' placeholder='public_id' onChange={(e)=> setCloudiId(e.target.value) }  />
                    </div>
                    <hr />

                    <div>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>asset_id</th>
                                    <th>public_id</th>
                                    <th>asset_folder</th>
                                    <th>filename</th>
                                    <th>format</th>
                                    <th>url</th>
                                    <th>updated_at</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listImages.length > 0 && (
                                        listImages.map((image, i)=> (
                                            <tr key={i}>
                                                <td>{image.asset_id}</td>
                                                <td>{image.public_id}</td>
                                                <td>{image.asset_folder}</td>
                                                <td>{image.filename}</td>
                                                <td>{image.format}</td>
                                                <td>{image.url}</td>
                                                <td>{ 
                                                    //formatData(image.last_updated?.updated_at) 
                                                }</td>
                                            </tr>
                                        ))
                                    )
                                }
                                <tr></tr>
                            </tbody>
                        </table>
                    </div>

                    <hr />

                    <div className='my-5 w-192'>
                        <figure>
                            {
                                imageCloudi && (
                                    <img src={imageCloudi?.url} >
                                    </img>
                                )
                            }
                        </figure>
                    </div>

                    <hr />
                    <div className='mb-48'>
                    {
                        listImages.length > 0 && (
                            <>
                                <Slider {...sliderSettins} className='w-192'>
                                    {
                                        listImages.map((image, i) => (
                                            <figure key={i} className='flex-none grid content-center max-h-160'>
                                                <img
                                                    src={image.url}
                                                    alt={image.description}
                                                    className="w-full h-auto max-h-140 object-contain"
                                                />
                                                <div className='flex my-5 gap-2 justify-center'>
                                                    <a href="" className='btn btn-sm btn-ghost'>{image.public_id.substring(36, 38)}</a>
                                                    <button className='btn btn-sm' onClick={()=> deleteImage(image.public_id)}>Excluir</button>
                                                    <button className='btn btn-sm' onClick={teste} >Teste</button>
                                                </div>
                                            </figure>
                                            
                                        ))      
                                    }
                                </Slider>
                            </>
                        )
                    }
                    </div> */}


                    
                </Body>
            </Provider>
        </>
    )
}