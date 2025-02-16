import React, { useState, useRef, useEffect } from "react"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import axios from "axios"
import PostView from '../components/PostView'

export default function Feed() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [postList, setPostList] = useState([])
    const { data: session, status } = useSession()
    const router = useRouter()
    const [testeView, setTesteView] = useState()
    const [userGoogle, setUserGoogle] = useState()
 
    useEffect(()=> {
        const info= {
            order: -1,
            limit: 5
        }

        const getPostList = async() => {
            const response = await axios.post(`${url}/post/aggregate`, info)
            setPostList(response.data)
            //console.log("getPostList: ", response.data)
        }

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
        
        <div className="flex flex-col items-center mb-6">
            
            {/* <div className="my-4">
                <button className="btn btn-primary" onClick={teste}>teste</button>
            </div> */}

            <div className="flex flex-col w-192">
                {/* <div className="container-fluid bg-amber-800 m-4 p-4">
                    <p>{testeView}</p>
                    <p>{session?.user?.name}</p>
                    <p>{typeof(userGoogle)}</p>
                    <button className="btn btn-circle btn-primary" onClick={teste}>opa...</button>
                </div> */}

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
                            ></PostView>
                        </div>

                        
                    ))
                }
            </div>
            
        </div>
        </>
    )
}