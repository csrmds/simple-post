import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'

import Body from './components/layout/Body'
//import Feed from './components/Feed'
const Feed = dynamic(()=> import('./components/Feed'), {ssr: false})


export default function Home() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        console.log("-----INDEX COMPONENT-----")
        console.log("Session expires: ", session?.expires)
        console.log("Status: ", status)
    }, [])

    return (
        <>
            
            <Body titulo="Feed">
                {
                    status== "authenticated" ? (
                        <>
                            <Feed></Feed>
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="card bg-violet-950 w-96 md:w-140 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-white">Usuário não autenticado</h2>
                                    <p>É necessario fazer autenticação de usuário para acessar essa página.</p>
                                    <div className="divider"></div>
                                    <div className="card-actions justify-end">
                                        <button className="btn btn-primary w-24" onClick={()=> router.push('/login')}>Login</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                
            </Body>
            
        </>
    )
}