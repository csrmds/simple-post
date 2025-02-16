import { useState } from "react"
import { signIn } from 'next-auth/react'
import { useRouter } from "next/router"

export default function login() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const router= useRouter()
    const [email, setEmail] = useState("pedro.santos@example.com")
    const [password, setPassword] = useState()
    const [error, setError] = useState(false)
    const [message, setMessage] = useState("")

    const credentialLogin= async (e)=> {
        //console.log("credentialLogin prevent: ",e)
        e.preventDefault()

        const res = await signIn("credentials", {
            email: e.target.email.value,
            password: e.target.password.value,
            redirect: false,
        })
        if (res.error || res.ok== false) {
            setError(true)
            setMessage(res.error)
            console.log("erro signIn: ", res.error, "\nRes: ", res)
        }  else {
            setError(false)
            setMessage("")
            //console.log('Validação teoricamenteo OK', res)
            router.push('/')
        }
    }

    const googleLogin= async (e)=> {
        e.preventDefault()
        signIn('google', {callbackUrl: 'localhost:3000'})
    }



    return (
        <>
            {/* <div className="card card-side bg-violet-950 shadow-xl"> */}
            <div className="card card-side bg-gradient-to-tr from-sky-300 from-30% to-violet-950 to-95%  shadow-2xl">
                <figure>
                    <img
                        className="w-96"
                        src={url+"/images/login.jpg"}
                        alt="Login" />
                </figure>
                <div className="card-body">
                    <h2 className="card-title text-gray-200">Login PostApp</h2>

                    <form onSubmit={credentialLogin}>
                        <div className="h-full">
                            <label className="input input-bordered flex items-center gap-2 my-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                                    className="h-4 w-4 opacity-70">
                                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                </svg>
                                <input type="text" name="email" className="grow" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} value={email}/>
                            </label>
                            <label className="input input-bordered flex items-center gap-2 my-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                                    className="h-4 w-4 opacity-70">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                </svg>
                                <input type="password" name="password" className="grow" onChange={(e)=>setPassword(e.target.value)} value={password} />
                            </label>

                            <div className="card-actions justify-between mt-6">
                                <button className="btn btn-primary w-24 shadow-md" type="submit">Login</button>
                                <button className="btn btn-primary w-24 shadow-md" onClick={googleLogin}>Google</button>
                            </div>

                            {
                                error && (
                                    <div role="alert" className="alert alert-error mt-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <span>{message}</span>
                                        <div>
                                            <button className="" onClick={()=> setError(false)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                            
                            
                        </div>
                    </form>
                    
                </div>
            </div>
        </>
    )
}