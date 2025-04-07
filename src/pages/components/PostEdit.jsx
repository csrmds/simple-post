import React, { useState } from "react"
import axios from "axios"


export default function PostEdit() {
    const url= process.env.NEXT_PUBLIC_BACKEND_URL
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [attachment, setAttachment] = useState([])

    


    return (
        <>
        <div className="justify-center">
            

            
        </div>
        
        </>
    )
}