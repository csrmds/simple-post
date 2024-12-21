import Body from './components/layout/Body'
import Post from './components/Post'

export default function home(props) {
    return (
        <>
            <Body titulo="Home Post">
                <Post></Post>
            </Body>
        </>
    )
}