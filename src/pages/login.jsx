import Body from './components/layout/Body'
import Login from './components/Login'

export default function home(props) {
    return (
        <>

                <div className='container-fluid flex justify-center h-screen'>
                    <div className='w-224 content-center'>
                        <Login></Login>
                    </div>
                </div>
            
            
        </>
    )
}