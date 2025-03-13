import React, { useState, useRef, useEffect } from "react"
import { useSession } from 'next-auth/react'
import axios from "axios"
import PostView from '../components/PostView'
import PostNew from '../components/PostNew'

export default function Feed() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [postList, setPostList] = useState([])
    const { data: session, status } = useSession()
    const [testeView, setTesteView] = useState()
    const [userGoogle, setUserGoogle] = useState()
    const [registro, setRegistro] = useState()

    const [postsByPage, setPostsByPage] = useState([])
    const [page, setPage] = useState(1)
    const [nextPage, setNextPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const observerRef = useRef(null)
    const [itemView, setItemView] = useState(false)
    const [payload, setPayload] = useState({order: -1, limit: 5, page: 1})

    const refreshPostsList = async() => {
        
        console.log("chamou refreshPostsList\nPayload:")
        
        // setPayload((prev) => {
        //     const newPayload= { ...prev, page: 1}
        //     return newPayload
        // })
        console.log(payload)    

        try {
            
            const response = await axios.post(`${url}/post/list`, payload)
            setPostsByPage(response.data.docs)
            setHasMore(response.data.hasNextPage)
            setPage(response.data.pagingCounter)
            setNextPage(response.data.nextPage)
            setPayload({order: -1, limit: 5, page: response.data.nextPage})
        } catch(err) {
            console.error("erro ao listar posts..", err)
        }
    }

    const updatePayload = () => {
        setPayload({order: -1, limit: 5, page: 1})
        console.log("update Payload: ", payload)
    }

    const postsList = async() => {
        //console.log("chamou postList\nloading: ", loading)
        if (!hasMore) return;
        
        try {
            const response = await axios.post(`${url}/post/list`, payload)
            setTimeout(()=> {
                setPostsByPage((prev) => [...prev, ...response.data.docs])
                setHasMore(response.data.hasNextPage)
                setPage(response.data.pagingCounter)
                setNextPage(response.data.nextPage)
                setPayload({order: -1, limit: 5, page: response.data.nextPage})
            }, 1000)
               
        } catch(err) {
            console.error("erro ao listar posts..", err)
        }
        
    }
 
    useEffect(()=> {

        if (status === 'unauthenticated') setTesteView("usuario não autenticado...")
        if (status=== "loading") setTesteView("carregando...")
        if (status === 'authenticated') setUserGoogle(session?.user)
        
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    postsList()
                }
            },
            { threshold: 1.0}
        )

        if (observerRef.current) {
            observer.observe(observerRef.current)
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current)
            }
        }

        
    }, [status, hasMore])


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
        <div className="space-x-2">
            <button className="btn btn-default" onClick={postsList}>postList</button>
            <button className="btn btn-success" onClick={()=> console.log("payload click: ",payload)}>Load posts by page</button>
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

        

        <PostNew refreshPostList={refreshPostsList} updatePayload={updatePayload} />


        <div className="flex flex-col items-center mb-6">
            <div className="flex flex-col w-192">

                {
                    postsByPage.map((post) => (
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
                                refreshPostList={refreshPostsList}
                            />
                        </div>
                    ))
                    
                }

                {
                    hasMore && (
                        <div className="flex justify-center my-2" ref={observerRef}>
                            <span className="loading loading-spinner loading-xl"></span>
                        </div>

                    )
                    
                }

                {/* { loading && (
                    <div className="flex justify-center my-2">
                        <span className="loading loading-spinner loading-xl"></span>
                    </div>
                ) } */}

            </div>
            
        </div>
        </>
    )
}