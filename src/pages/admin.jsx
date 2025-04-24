import { useState } from 'react'
import { Provider } from 'react-redux'
import store from '../redux/store'
import { format, intervalToDuration, formatDistanceToNowStrict } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import axios from 'axios'

import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';


import Body from './components/layout/Body'
import PostList from './components/PostList'
import PostListRedux from './components/PostListRedux'
import UserAdmin from './components/UserList'
import PostEdit from './components/PostEdit'




export default function admin(props) {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [content, setContent] = useState(props.content)
    const [postImage, setPostImage] = useState(props.images)
    const [selectedFiles, setSelectedFiles] = useState([])
    const [cloudiImages, setcloudiImages] = useState([])


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
            return format(updatedAt, "dd MMMM - HH:mm", { locale: ptBR })
        } else {
            return formatada
        }
    }


    return (
        <>
            <Provider store={store}>
                <Body titulo="Admin page">
                    <div className='my-4 gap-2'>
                        <input type="file" onChange={(e)=> handleFileCloudi(e)} className='file-input file-input-bordered w-full max-w-xs' multiple />
                        <button className='btn btn-primary' onClick={uploadImages}>subir pro cloudi</button>
                    </div>
                    
                </Body>
            </Provider>
        </>
    )
}