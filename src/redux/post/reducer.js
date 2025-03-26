const initialState = {
    currentState: null
}

const postReducer = (state = initialState, action) => {
    if (action.type== 'post/teste') {
        return { ...state, currentState: action.payload }
    }

    return state
}


export default postReducer