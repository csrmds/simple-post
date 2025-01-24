import React, { useState, useRef, useEffect } from "react"
import axios from "axios"
import PostView from '../components/PostView'

export default function Feed() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [postList, setPostList] = useState([])
 
    useEffect(()=> {
        const info= {
            order: -1,
            limit: 5
        }

        const getPostList = async() => {
            const response = await axios.post(`${url}/post/aggregate`, info)
            setPostList(response.data)
        }

        getPostList()
    }, [])


    const teste = () => {
        postList.map((post)=> {
            console.log(post.images)
        })   
    }

    

    
    

    return (
        <>
        
        <div className="flex flex-col items-center mb-6">
            
            <div className="my-4">
                <button className="btn btn-primary" onClick={teste}>teste</button>
            </div>

            <div className="flex flex-col w-192 overflow-x-auto">
                {
                    postList.map((post) => (
                        <div className="mb-8" key={post._id}>
                            <PostView
                                postId= {post._id}
                                content= {post.content}
                                title= {post.title}
                                createdAt= {post.createdAt}
                                images= {post.images}
                            ></PostView>
                        </div>

                        
                    ))
                }
            </div>
            
            {/* <div className="flex flex-col w-192 overflow-x-auto">

                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>Post Id</th>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Data</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            //quero que os dados sejam renderizados aqui...
                            postList.length > 0 && (
                                postList.map((post) => (
                                    <tr key={post._id}>
                                        <td>{post._id}</td>
                                        <td>{post.title}</td>
                                        <td>{post.content}</td>
                                        <td>{new Date(post.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) 
                        }
                    </tbody>

                </table>
                
            </div> */}
        </div>
        </>
    )
}