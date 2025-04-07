import { useState } from 'react'
import { Provider } from 'react-redux'
import store from '../redux/store'
import { format, intervalToDuration, formatDistanceToNowStrict } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import axios from 'axios'


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
                    <button className="btn" onClick={() => document.getElementById('my_modal_1').showModal()}>open modal</button>
                    
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box max-w-3xl">

                            <div className='flex justify-between mb-2'>
                                <div className="avatar">
                                    <div className="w-12 rounded-full">
                                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                    </div>
                                </div>
                                <div>
                                    { formatData(new Date("2025-04-02T03:24:00"))  }
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
                                <button className="btn">Atualizar</button>
                                <form method="dialog">
                                    {/* if there is a button in form, it will close the modal */}
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </Body>
            </Provider>
        </>
    )
}