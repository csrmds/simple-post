import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { format, intervalToDuration, formatDistanceToNowStrict } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import axios from 'axios'
import mongoose from 'mongoose'


export default function PostEdit(props) {
    const url= process.env.NEXT_PUBLIC_BACKEND_URL
    const [content, setContent] = useState("")
    const [images, setImages] = useState([])
    const [updatedAt, setUpdatedAt] = useState(Date())

    
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
        console.log("-----getPost-----")
        console.log("postId: ", postId)

        try {
            const response = await axios.post(`${url}/post/id/`, {postId: postId})
            setContent(response.data.content)
            setUpdatedAt(response.data.updatedAt)
            console.log("response.data: ", response.data)
        } catch(err) {
            console.error("Erro ao buscar post por ID: ", err)
        }
    }

    const updatePost = async () => {
        console.log("-----updatePost-----")

        let post= {
            _id: new mongoose.Types.ObjectId(props.postId),
            content: content
        }

        try {
            const response = await axios.post(`${url}/post/update/`, {post: post})
            console.log("respone: ", response.data)
        } catch(err) {
            console.error("Erro ao atualizar post.", err)
        }
    }


    useEffect(()=> {
        getPost(props.postId)
    }, [])


    return (
        <>
            <div className='flex justify-between mb-2'>
                <div className="avatar">
                    <div className="w-12 rounded-full">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                </div>
                <div>
                    {formatData(updatedAt) ?? ""}
                </div>
            </div>

            <div className='my-2'>
                <p>aqui vai um carrossel de imagens</p>
                <p>aqui ações para excluir foto, ou add foto</p>
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
            <div className="modal-action mt-4">
                <button className="btn" onClick={updatePost}>Atualizar</button>
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                </form>
            </div>
        
        </>
    )
}