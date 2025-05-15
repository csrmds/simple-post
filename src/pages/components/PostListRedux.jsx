import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
//import { postListReducer } from '../../redux/post-list/reducer'
//import rootReducer from '../../redux/reducers'
//import rootReducer from '../../redux/reducers'



export default function PostListRedux() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const dispatch= useDispatch()
    const currentPostList = useSelector((state) => state.postListReducer.currentPostList)
    var paginateOptions = { 
        order: currentPostList.order, 
        limit: currentPostList.limit, 
        page: currentPostList.page 
    }
    
    useEffect(()=> {
        //getPostList()
    }, [])

    const getPostList = async () => {
        try {
            const response = await axios.post(`${url}/post/list`, paginateOptions)
            //console.log("response data: ", response.data)
            dispatch({ type: "postList/get", payload: response.data })
        } catch(err) {
            console.error("erro ao listar posts...", err)
        }
    }


    const handleGetPostList = () => {
        console.log("currentPostList: ", currentPostList)
    }

    const nextPage = () => {
        paginateOptions.page =  currentPostList.nextPage
        console.log("paginate options: ", paginateOptions)
        getPostList()
    }

    const prevPage = () => {
        paginateOptions.page = currentPostList.prevPage
        console.log("paginate options: ", paginateOptions)
        getPostList()
    }
    


    return (
        <>
            <div className='flex gap-5 mb-6'>
                <button className='btn btn-outline' onClick={getPostList} >getPostList</button>
                <button className='btn btn-outline btn-success' onClick={handleGetPostList} >consulta</button>
            </div>

            <div className='flex-none mb-6'>
                {
                    currentPostList?.docs.map((post)=> (
                        <p key={post._id}>{post.title}</p>
                    ))   
                }

            </div>

            <div className='flex gap-5'>
                <button className={`btn btn-accent ${!currentPostList.prevPage && "pointer-events-none opacity-40"}`} onClick={prevPage} >Prev</button>
                <button className={`btn btn-accent ${!currentPostList.nextPage && "pointer-events-none opacity-40"}`} onClick={nextPage} >Next</button>
            </div>
        </>
    )
}