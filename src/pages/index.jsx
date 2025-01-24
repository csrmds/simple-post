import Feed from './components/Feed'
import Body from './components/layout/Body'
import PostMock from './components/PostMock'
import PostNew from './components/PostNew'

export default function home(props) {
    return (
        <>
            <Body titulo="Home Post">
                <PostNew></PostNew>
                {/* <PostMock postId="677593d4b665a5af3e8036ea"></PostMock> */}
                <Feed></Feed>
            </Body>
        </>
    )
}