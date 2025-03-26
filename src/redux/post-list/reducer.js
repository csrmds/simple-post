const url = process.env.NEXT_PUBLIC_BACKEND_URL
const initialState = {
    currentPostList: {
        docs: [],
        totalDocs: null,
        limit: 5,
        page: 1,
        totalPages: null,
        pagingCounter: null,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
        order: -1
    }
}

const postListReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'postList/get':
            return { ...state, currentPostList: action.payload }
        case 'postList/append':
            return {
                ...state,
                currentPostList: {
                    ...state.currentPostList,
                    docs: [...state.currentPostList.docs, ...action.payload.docs],
                    page: action.payload.page,
                    hasNextPage: action.payload.hasNextPage,
                    nextPage: action.payload.nextPage
                }
            }
        default:
            return state
    }

}


export default postListReducer