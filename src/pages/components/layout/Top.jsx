import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Navbar from '../Navbar'
import { useEffect } from 'react'


export default function top(props) {

    return (
        <>
            <Navbar></Navbar>
        </>
    )
}