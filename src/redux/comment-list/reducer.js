const initialState = {
    currentCommentList: {
        _id: null,
        foreignId: null,
        text: null,
        type: null,
        user: null,
        likes: null,
        responseId: null,
        createdAt: null,
        updatedAt: null,
    }
}

const commentListReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'commentList/get':
            return {...state, currentCommentList: action.payload}
        default: 
            return state
    }
}


export default commentListReducer