import { useEffect, useState } from "react"
import { signIn } from 'next-auth/react'
import { useRouter } from "next/router"

export default function Login() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const urlFrontend = process.env.NEXT_PUBLIC_FRONTEND_URL
    const router= useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("PostProject!")
    const [error, setError] = useState(false)
    const [message, setMessage] = useState("")

    const userEmail= [ 
        "joao.silva@example.com", 
        "maria.oliveira@example.com", 
        "pedro.santos@example.com",
        "janaina.alves@example.com",
    ]

    const randomEmail = Math.floor(Math.random() * userEmail.length)

    useEffect(()=> {
        //console.log("NEXTAUTH_URL: ", urlFrontend)
        setEmail(userEmail[randomEmail])
    }, [])

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
        signIn('google', {callbackUrl: urlFrontend})
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
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                </svg>
                                <input type="text" name="email" className="grow" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} value={email}/>
                            </label>
                            <label className="input input-bordered flex items-center gap-2 my-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                                </svg>
                                <input type="password" name="password" className="grow" onChange={(e)=>setPassword(e.target.value)} value={password} />
                            </label>

                            <div className="card-actions justify-between mt-6">
                                <button className="btn btn-primary w-40 shadow-md rounded-full" type="submit">Login</button>
                                
                                <button className="gsi-material-button" onClick={googleLogin}>
                                    <div className="gsi-material-button-state"></div>
                                    <div className="gsi-material-button-content-wrapper">
                                        <div className="gsi-material-button-icon">
                                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xlink="http://www.w3.org/1999/xlink" style={{"display": "block"}}>
                                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                                <path fill="none" d="M0 0h48v48H0z"></path>
                                            </svg>
                                        </div>
                                        <span className="gsi-material-button-contents">Sign in with Google</span>
                                        <span style={{"display": "none"}}>Sign in with Google</span>
                                    </div>
                                </button>

                                {/* <button className="btn btn-primary w-24 shadow-md" onClick={googleLogin}>Google</button> */}
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