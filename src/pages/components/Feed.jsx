import React, { useState, useRef, useEffect } from "react"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import axios from "axios"
import PostView from '../components/PostView'
import PostNew from '../components/PostNew'

export default function Feed() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [postList, setPostList] = useState([])
    const { data: session, status } = useSession()
    const router = useRouter()
    const [testeView, setTesteView] = useState()
    const [userGoogle, setUserGoogle] = useState()
    const [registro, setRegistro] = useState()

    const info= {
        order: -1,
        limit: 30
    }

    const getPostList = async() => {
        console.log("chamou getPostList..")
        const response = await axios.post(`${url}/post/aggregate`, info)
        setPostList(response.data)
        //console.log("getPostList: ", response.data)
    }

    const postsList = async() => {
        const response = await axios.post(`${url}/post/list`, info)
        setRegistro(response.data)
        console.log(response.data)
    }
 
    useEffect(()=> {

        if (status === 'unauthenticated') {
            setTesteView("usuario não autenticado...")
        }

        if (status=== "loading") setTesteView("carregando...")

        if (status === 'authenticated') setUserGoogle(session?.user)

        getPostList()
    }, [status])


    const teste = () => {
        // postList.map((post)=> {
        //     console.log(post.images)
        // })
        //console.log(session?.user)
        // Object.keys(userGoogle).forEach((item)=> {
        //     console.log(item," - ", item.)
        // })
    }

    

    
    

    return (
        <>
        <div>
            <button className="btn btn-default" onClick={postsList}>postList</button>
        </div>
        
        <div className="flex flex-col items-center mb-6 overflow-x-auto">
            <table className="table">
                <tbody>
                    {
                        registro?.docs.length > 0 && (
                            registro.docs.map((reg, i) => (
                                <tr key={i}>
                                    <td>{ reg._id }</td>
                                    <td>{ reg.title }</td>
                                    <td>{ reg.content }</td>
                                </tr>
                            ))
                            
                        )
                    }
                    
                </tbody>
            </table>
        </div>

        

        <PostNew refreshPostList={getPostList} />
        
        <div className="flex flex-col items-center mb-6">
            <div className="flex flex-col w-192">

                {
                    postList.map((post) => (
                        <div className="mb-8" key={post._id}>
                            <PostView
                                postId= {post._id}
                                content= {post.content}
                                title= {post.title}
                                createdAt= {post.createdAt}
                                images= {post.images}
                                comments= {post.comments}
                                author= {post.author[0]}
                                likes= {post.likes}
                                refreshPostList={getPostList}
                            />
                        </div>

                        
                    ))
                }
            </div>
            
        </div>
        </>
    )
}