import { combineReducers } from 'redux'
import postReducer from './post/reducer'
import postListReducer from './post-list/reducer'
import postCommentListReducer from './comment-list/reducer'

const rootReducer = combineReducers({ postListReducer })


export default rootReducer
