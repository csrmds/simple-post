import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Footer from './Footer'
import Top from './Top'

export default function body(props) {
    const { data: session, status } = useSession()
    const [ loginInfo, setLoginInfo ] = useState()
    const router = useRouter()

    
    useEffect(()=> {
        if (status === 'unauthenticated') {
            setLoginInfo("usuario não autenticado...")
        }

    }, [status, router])

    //if (status=== "loading") setLoginInfo("carregando...")



    return (
        <>
            <Top></Top>
            <div className='m-4'>
                <h1>{props.titulo}</h1>
            </div>
            <div className="divider"></div>
            
            <div className='container p-4 mx-auto'>
                {props.children}
            </div>
            
            
            {/* <Footer></Footer> */}
        </>
    )
}