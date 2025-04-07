import Body from './components/layout/Body'
import PostList from './components/PostList'
import PostListRedux from './components/PostListRedux'
import UserAdmin from './components/UserList'

import { Provider } from 'react-redux'
import store from '../redux/store'



export default function admin(props) {


    return (
        <>
            <Provider store={store}>
                <Body titulo="Admin page">
                    <UserAdmin></UserAdmin>
                </Body>
            </Provider>
        </>
    )
}