import { combineReducers } from 'redux'
import postReducer from './post/reducer'
import postListReducer from './post-list/reducer'

const rootReducer = combineReducers({ postReducer, postListReducer })


export default rootReducer
