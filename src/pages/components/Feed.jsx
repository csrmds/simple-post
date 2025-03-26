import React, { useState, useRef, useEffect, useCallback } from "react"
import { useSession } from 'next-auth/react'
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import PostView from '../components/PostView'
import PostNew from '../components/PostNew'

export default function Feed() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [postList, setPostList] = useState([])
    const { data: session, status } = useSession()
    const [testeView, setTesteView] = useState("")
    const [userGoogle, setUserGoogle] = useState({})
    const [registro, setRegistro] = useState()

    const [postsByPage, setPostsByPage] = useState([])
    const [page, setPage] = useState(1)
    const [nextPage, setNextPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const observerRef = useRef(null)
    const [itemView, setItemView] = useState(false)
    const [paginateOptions, setPaginateOptions] = useState({order: -1, limit: 5, page: 1})

    const dispatch= useDispatch()
    const currentPostList = useSelector((state) => state.postListReducer.currentPostList)
    

    const getPostList =  useCallback(async () => {
        console.log("chamou getPostList..")
        try {
            const response = await axios.post(`${url}/post/list`, paginateOptions)
            // console.log('paginateOptions: ', paginateOptions)
            console.log('response.data: ', response.data)
            dispatch({
                type: "postList/get", 
                payload: response.data 
            })
        } catch(err) {
            console.error("erro ao listar posts com useDispatch...", err)
        }
    }, [dispatch, url, paginateOptions])
    
    const updatePostList = async () => {
        console.log("chamou updatePostList")
        try {
            if (currentPostList.hasNextPage) {
                const response = await axios.post(`${url}/post/list`, {
                    page: currentPostList.nextPage,
                    limit: 5
                })
                // console.log('paginateOptions: ', paginateOptions)
                console.log('response.data: ', response.data)
                dispatch({
                    type: "postList/append",
                    payload: response.data
                })
            }
        } catch(err) {
            console.error("erro ao atualizar posts com useDispatch...", err)
        }
    }

 
    useEffect(()=> {
        if (status === 'unauthenticated') setTesteView("usuario não autenticado...")
        if (status=== "loading") setTesteView("carregando...")
        if (status === 'authenticated') setUserGoogle(session?.user)
        
        getPostList()
        console.log("useEffect currentpostList: ", currentPostList)

        // setPaginateOptions({
        //     order: currentPostList.order,
        //     limit: currentPostList.limit,
        //     page: currentPostList.page
        // })

    }, [status])


    useEffect(()=> {
        
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && currentPostList.hasNextPage) {
                    console.log('observer disparado...')
                    setTimeout(()=> updatePostList(), 1000)
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
        
    }, [currentPostList])

    

    
    

    return (
        <>
        <div className="space-x-2">
            {/* <button className="btn btn-default" onClick={updatePostList}>updatePostList</button> */}
            <button className="btn btn-success" onClick={getPostList}>getPostList</button>
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

        

        <PostNew getPostList={getPostList} updatePaginateOptions={()=> setPaginateOptions({order: -1, limit: 5, page: 1})} />


        <div className="flex flex-col items-center mb-6">
            <div className="flex flex-col w-192">

                {
                    currentPostList.docs.map((post) => (
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

                {
                    currentPostList.hasNextPage && (
                        <div className="flex justify-center my-2" ref={observerRef} id="spinnerLoadding">
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