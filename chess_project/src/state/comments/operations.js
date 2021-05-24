import {createAction} from "redux-api-middleware";
import {ADD_FAILURE, ADD_REQUEST, ADD_SUCCESS, DELETE_FAILURE, DELETE_REQUEST, DELETE_SUCCESS} from "./types";

const addComment = (game_id, commentJSON) => dispatch => {
    console.log("Dodaje komentarz do BAZY i STORE!")
    dispatch(createAction({
        endpoint: `http://localhost:5000/api/games/${game_id}/comment`,
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(commentJSON),
        types: [
            ADD_REQUEST,
            ADD_SUCCESS,
            ADD_FAILURE]
    }))
}

const deleteComment = (game_id, commentId) => dispatch => {
    console.log("Usuwam komentarz z BAZY i STORE!")
    dispatch(createAction({
        endpoint: `http://localhost:5000/api/games/${game_id}/comment/${commentId}`,
        method: 'DELETE',
        headers: {
            "Accept": "application/json",
        },
        types: [
            DELETE_REQUEST,
            DELETE_SUCCESS,
            DELETE_FAILURE]
    }))
}

const commentsOperations = {
    addComment,
    deleteComment
}

export default commentsOperations
