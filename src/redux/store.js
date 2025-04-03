import { createStore, applyMiddleware, compose } from "redux";
import logger from "redux-logger";

import rootReducer from "./reducers";

const composeEnhancers = 
    typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

//const store = createStore(rootReducer, applyMiddleware(logger))
const store = createStore(
    rootReducer,
    composeEnhancers()
)


export default store