import Login from './components/Login'

export default function Home() {
    return (
        <>
            <div className='container-fluid flex justify-center h-screen'>
                <div className='content-center w-96 lg:w-224'>
                    <Login></Login>
                </div>
            </div>  
        </>
    )
}