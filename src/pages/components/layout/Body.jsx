import Footer from './Footer'
import Top from './Top'


export default function body(props) {
    return (
        <>
            <Top></Top>
            <div className='m-4'>
                <h1>{props.titulo}</h1>
            </div>
            <div className="divider"></div>
            
            <div className='container p-4'>
                {props.children}
            </div>
            
            
            {/* <Footer></Footer> */}
        </>
    )
}