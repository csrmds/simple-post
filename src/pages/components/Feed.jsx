import React, { useState, useRef, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
//import PostView from '../components/PostView'
import PostNew from '../components/PostNew'
import PostViewNew from '../components/PostViewNew'

export default function Feed() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const observerRef = useRef(null)
    const [paginateOptions, setPaginateOptions] = useState({order: -1, limit: 5, page: 1})
    
    const dispatch= useDispatch()
    const currentPostList = useSelector((state) => state.postListReducer.currentPostList)
    

    const getPostList =  useCallback(async () => {
        //console.log("chamou getPostList..")
        try {
            const response = await axios.post(`${url}/post/list`, paginateOptions)
            dispatch({
                type: "postList/get", 
                payload: response.data 
            })
        } catch(err) {
            console.error("Erro ao listar posts.", err)
        }
    }, [dispatch, url, paginateOptions])
    
    
    const updatePostList = async () => {
        //console.log("chamou updatePostList")
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
        getPostList()
    }, [])


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

        <div className="flex justify-center mb-6 w-full mx-auto lg:w-192">
            <PostNew 
                getPostList={getPostList} 
                updatePaginateOptions={()=> setPaginateOptions({order: -1, limit: 5, page: 1})} 
            />
        </div>


        <div className="flex flex-col items-center gap-10">            

                {
                    currentPostList.docs?.map((post, i) => (
                        <div key={i}>
                            <PostViewNew
                                postId= {post._id}
                                content= {post.content}
                                title= {post.title}
                                createdAt= {post.createdAt}
                                updatedAt= {post.updatedAt}
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
                    // LOADER DOS PROXIMOS POSTS
                    currentPostList.hasNextPage && (
                        <div className="flex justify-center my-2" ref={observerRef} id="spinnerLoadding">
                            <span className="loading loading-spinner loading-xl"></span>
                        </div>
                    )
                }
            
        </div>
        </>
    )
}