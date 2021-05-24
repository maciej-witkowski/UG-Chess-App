import {createAction} from 'redux-api-middleware';
import {
    ADD_FAILURE,
    ADD_REQUEST,
    ADD_SUCCESS,
    GAMES_FAILURE,
    GAMES_REQUEST,
    GAMES_SUCCESS,
    DELETE_FAILURE,
    DELETE_REQUEST,
    DELETE_SUCCESS,
    CHANGE_REQUEST, CHANGE_SUCCESS, CHANGE_FAILURE
} from "./types";

const getGames = () => dispatch => {
    console.log("Pobieram gry z BAZY!")
    dispatch(createAction({
        endpoint: 'http://localhost:5000/api/games',
        method: 'GET',
        headers: {
            "Accept": "application/json",
        },
        types: [
            GAMES_REQUEST,
            GAMES_SUCCESS,
            GAMES_FAILURE]
    }))
};

const addGame = (gameJSON) => dispatch => {
    console.log("Dodaje grę do BAZY i STORE!")
    dispatch(createAction({
        endpoint: 'http://localhost:5000/api/games',
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(gameJSON),
        types: [
            ADD_REQUEST,
            ADD_SUCCESS,
            ADD_FAILURE]
    }))
}

const deleteGame = (id) => dispatch => {
    console.log("Usuwam grę z BAZY i STORE!")
    dispatch(createAction({
        endpoint: `http://localhost:5000/api/games/${id}`,
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

const changeGame = (id, changes) => dispatch => {
    console.log("Zmieniam grę w BAZIE i STORE!")
    dispatch(createAction({
        endpoint: `http://localhost:5000/api/games/${id}`,
        method: 'PATCH',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(changes),
        types: [
            CHANGE_REQUEST,
            CHANGE_SUCCESS,
            CHANGE_FAILURE]
    }))
}

const gamesOperations = {
    getGames,
    addGame,
    deleteGame,
    changeGame
}

export default gamesOperations
