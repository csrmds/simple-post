import Top from './Top'

export default function body(props) {
    // const { data: session, status } = useSession()
    // const [ loginInfo, setLoginInfo ] = useState()
    
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
            
        </>
    )
}