import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


export default function navbar() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [user, setUser] = useState()

    useEffect(()=> {
        //console.log("Session on navbar: ", session, "\nstatus: ", status)
        if(session?.user) {
            const userJson= JSON.parse(JSON.stringify(session?.user))
            if (status== "authenticated") setUser(userJson)
            //console.log("User: ", user)

        } 

    }, [status])

    const userView = ()=> {
        console.log("Session: ",session)
        console.log("Status: ",status)
    }

    const logout = () => {
        signOut()
    }

    return (
        <>
            <div className="navbar bg-cyan-700">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">PostApp</a>
                </div>
                <div className="flex-none gap-2">
                    {/* <div className="form-control form-inline">
                        <div className='form-group'>
                            <input type="text" placeholder="" className="input input-bordered w-24 md:w-auto" readOnly />
                            {
                                status === "unauthenticated" ? ( <button className='btn btn-md' onClick={()=> router.push("/login")} >Login</button> ) : ( <span></span> )
                            }
                        </div>
                    </div> */}

                    <div className="dropdown dropdown-end">

                        {
                            status === "authenticated" ? (
                                <>
                                    
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                        <div className="w-10 rounded-full">
                                            <img alt="Tailwind CSS Navbar component" src={user?.image || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                                        </div>
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                        <li><a>{session?.user?.name}</a></li>
                                        <li><a onClick={()=> logout() }>Logout</a></li>
                                    </ul>
                                </>
                                
                            ) : (
                                <>
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                        <div className="w-10 rounded-full">
                                            <div className='bg-gray-600 w-full h-full'></div>
                                        </div>
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                        <li><a onClick={()=> router.push("/login")}>Login</a></li>
                                    </ul>
                                </>
                            )
                        }
                        
                    </div>
                </div>
            </div>
        </>
    )
}