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
        case 'postList/setComment':
            return {
                ...state,
                currentPostList: {
                    ...state.currentPostList.docs.map(post => ({
                        ...post, comments: post.comments.map(comment => comment._id === action.payload.commentId
                            ? { ...comment, text: action.payload.newText }
                            : comment
                        )
                    }))
                }
            }
        case 'postList/updateCommentById':
            return {
                ...state,
                currentPostList: {
                    ...state.currentPostList,
                    docs: [
                        ...state.currentPostList.docs.map(post => ({
                            ...post, comments: post.comments.map(comment => comment._id === action.payload.commentId 
                                ? action.payload.comment 
                                : comment
                            )
                        }))
                    ]
                }
            }
        case 'postList/updatePostLikes':
            return {
                ...state,
                currentPostList: {
                    ...state.currentPostList,
                    docs: [
                        ...state.currentPostList.docs.map(post => post._id === action.payload.postId 
                            ? { ...post, likes: action.payload.likes } 
                            : post
                        )
                    ]
                }
            }
        case 'postList/updatePostComments':
            return {
                ...state,
                currentPostList: {
                    ...state.currentPostList,
                    docs: [
                        ...state.currentPostList.docs.map(post => post._id === action.payload.postId
                            ? { ...post, comments: action.payload.comments }
                            : post
                        )
                    ]
                }
            }
        default:
            return state
    }

}

// ...state.currentPostList.docs.map(post => ({
//     ...post, comments: post.comments.map(comment => comment._id == action.payload.commentId
//         ? {
//             ...comment,
//             text: action.payload.comment.text,
//             updatedAt: action.payload.comment.updatedAt,
//             likes: action.payload.comment.likes
//         } : {
//             comment
//         }
//     )
// })),
// novoCampo: "novo valor onde???",
// docs: action.payload.postCorrecao,
// hasNextPage: false


export default postListReducer