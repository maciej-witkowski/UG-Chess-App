import {ADD_SUCCESS, DELETE_SUCCESS} from "../types";

const comments = (state = [], action) => {
    switch (action.type) {
        case ADD_SUCCESS:
            return [...state, action.payload]
        case DELETE_SUCCESS:
            return state.filter(comment => comment._id !== action.payload.comment._id)
        default:
            return state;
    }
};

const commentsReducers = {
    comments
}

export default commentsReducers;