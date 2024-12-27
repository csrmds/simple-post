import React, { useEffect, useState } from "react"
import axios from "axios"

export default function PostList() {

    const [posts, setPosts] = useState(null)
    const [loading, setLoading] = useState(null)
    const url= process.env.NEXT_PUBLIC_BACKEND_URL

    const fetchData = async () => {
        await axios.get(`${url}/post`)
            .then((response) => {
                setPosts(response.data)
            })
            .catch((error) => {
                console.error("Erro ao listar posts: ", error)
            })
            .finally(() => {    
                setLoading(false)
            })
    }

    useEffect(()=> {
        //fetchData()
    }, [])


    const cleanData = () => {
        setPosts("")
    }

    return (
        <>
            <h3>Título da post list</h3>
            <div>
                <button className="btn btn-neutral" onClick={fetchData}>FetchData</button>
                <button className="btn btn-neutral" onClick={cleanData}>Limpar dados</button>
            </div>
            <br />

            <div className="overflow-x-auto">
                {loading ? (
                    <p>Carregando...</p> ) : 
                    posts && (
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Título</th>
                                <th>Conteúdo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.content}</td>
                                </tr>
                            )
                            )}
                        </tbody>
                    </table>
                )} 
            </div>
        </>
    )
}