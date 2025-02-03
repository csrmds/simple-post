import React, { useState, useRef, useEffect } from "react"
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import axios from "axios"
import PostView from '../components/PostView'

export default function Feed() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [postList, setPostList] = useState([])
    const { data: session, status } = useSession()
    const router = useRouter()
    const [testeView, setTesteView] = useState()
 
    useEffect(()=> {
        const info= {
            order: -1,
            limit: 5
        }

        const getPostList = async() => {
            const response = await axios.post(`${url}/post/aggregate`, info)
            setPostList(response.data)
        }

        if (status === 'unauthenticated') {
            setTesteView("usuario não autenticado...")
        }

        if (status=== "loading") setTesteView("carregando...")

        getPostList()
    }, [status])


    const teste = () => {
        postList.map((post)=> {
            console.log(post.images)
        })   
    }

    

    
    

    return (
        <>
        
        <div className="flex flex-col items-center mb-6">
            
            {/* <div className="my-4">
                <button className="btn btn-primary" onClick={teste}>teste</button>
            </div> */}

            <div className="flex flex-col w-192">
                <div className="container-fluid bg-amber-800 m-4 p-4">
                    <p>{testeView}</p>
                    <p>{session?.user?.name}</p>
                </div>

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
                            ></PostView>
                        </div>

                        
                    ))
                }
            </div>
            
        </div>
        </>
    )
}