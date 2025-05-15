import { useRouter } from 'next/router';

const useRoutes= () => {
    const router = useRouter();
    //const url= process.env.NEXT_PUBLIC_BACKEND_URL

    // const testeApi= () => {
    //     console.log('teste rota.. ', `${url}/api/rota`)
    //     //router.push(`${url}/api/rota`)
    // }

    // const rota= () => {
    //     console.log('segunda rota.. ', `${url}/api/rota`)
    //     return (router.push(`${url}/api/rota`))   
    // }

    const admin = () => {
        //return (router.push('/admin'))
        return (router.push('/'))
    }


    return {
        admin
    }
}


export default useRoutes