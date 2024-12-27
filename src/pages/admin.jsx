import Body from './components/layout/Body'
import PostList from './components/PostList'

export default function admin(props) {
    return (
        <>
            <Body titulo="Admin page">
                <PostList></PostList>
            </Body>
        </>
    )
}