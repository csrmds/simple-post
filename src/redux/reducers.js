import { combineReducers } from 'redux'
import postListReducer from './post-list/reducer'

const rootReducer = combineReducers({ postListReducer })

export default rootReducer
