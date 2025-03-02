import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import Feed from './components/Feed'
import Body from './components/layout/Body'
import PostMock from './components/PostMock'
import PostNew from './components/PostNew'
import Login from './components/Login'
import Carousel from './components/Carousel'


export default function home(props) {
    const { data: session, status } = useSession()
    const router = useRouter()

    return (
        <>
            <Body titulo="Home PostApp">
                {
                    status== "authenticated" ? (
                        <>
                            <Feed></Feed>
                        </>
                    ) : (
                        <div className="flex flex-col items-center h-160">
                            <div className="card bg-violet-950 w-140 shadow-xl">
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