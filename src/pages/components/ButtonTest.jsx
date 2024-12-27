import React, { useState } from "react"
import axios from "axios"


export default function botao(props) {
    const [postId, setPostId] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [posts, setPosts] = useState('')
    const [msg, setMsg] = useState(null)
    const url= process.env.NEXT_PUBLIC_BACKEND_URL

    const insertData = async () => {
        try {
            const response = await axios.post(`${url}/post/insert`, { title, content })
            console.log(response.data)
            setMsg( JSON.stringify(response.data) )
        } catch(error) {
            console.error("Erro ao acessar API: ", error)
            setMsg(error.message)
        }
    }

    const getPosts = async () => {
        await axios.get(`${url}/post`)
            .then((response) => {
                setPosts(response.data)
            })
            .catch((error) => {
                console.error("Erro ao listar posts: ", error)
            })
    }

    const getPostById = async () => { 
        await axios.get(`${url}/post/${postId}`)
            .then((response) => {
                setPostId(response.data._id)
                setTitle(response.data.title)
                setContent(response.data.content)
            })
            .catch((error) => {
                console.error("Erro ao listar posts: ", error)
            })
    }

    const updatePost = async () => {
        try {
            const response= await axios.post(`${url}/post/update`, { postId, title, content })
            .then((response) => {
                console.log(response.data)
                setMsg( JSON.stringify(response.data) )
            })
        } catch (error) { 
            console.error("Erro ao acessar API: ", error)
        }
        
    }

    return (
        <>
        <div className="form-control w-full max-w-xs">
            <div className="label">
                <span className="label-text">GetID</span>
            </div>
            <input type="text" id="postTitle" placeholder="getPostById" className="input input-bordered w-full max-w-xs" required
                value={postId} onChange={(e) => setPostId(e.target.value)}
            />
        </div>

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
        <div className="mt-4 mb-4">
            <button className="btn btn-primary m-2" onClick={insertData} >Postar</button>
            <button className="btn btn-primary m-2" onClick={getPostById} >GetPost</button>
            <button className="btn btn-secondary m-2" onClick={getPosts} >ListPosts</button>
            <button className="btn btn-secondary m-2" onClick={updatePost} >UpdatePost</button>
        </div>

        {
            insertData && (
                <div role='alert' className="alert alert-success">
                    <span>{msg}</span>
                </div>
            )
        }

        {
            posts && (
                <div className="mb-4 mt-4">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Título</th>
                                <th>Post</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post, index) => (
                                <tr key={post._id}>
                                    <th>{index}</th>
                                    <td>{post._id}</td>
                                    <td>{post.title}</td>
                                    <td>{post.content}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        }

        </>
    )

}