import {
    GAMES_SUCCESS,
    DELETE_SUCCESS,
    SORT_BY_DATE,
    SORT_BY_MOVES,
    SORT_BY_RATING,
    ADD_SUCCESS,
    CHANGE_SUCCESS
} from "../types";

const games = (state = [], action) => {
    switch (action.type) {
        case GAMES_SUCCESS:
            return [...action.payload]
        case ADD_SUCCESS:
            return [...state, action.payload]
        case DELETE_SUCCESS:
            return state.filter(game => game._id !== action.payload.game._id)
        case CHANGE_SUCCESS:
            console.log(action)
            return state.map(game => {
                return game._id === action.payload._id ? action.payload : game
            })
        default:
            return state;
    }
};

const filteredGames = (state = [], action) => {
    switch (action.type) {
        case SORT_BY_DATE:
            // console.log(sortGames(state, 'date', action.direction))
            // return sortGames(state, 'date', action.direction)
            return state.sort((a, b) => {
                if (a.createdAt > b.createdAt) return (action.direction === 'asc' ? 1 : -1)
                else if (a.createdAt < b.createdAt) return (action.direction === 'asc' ? -1 : 1)
                return 0
            })
        case SORT_BY_MOVES:
            // console.log(sortGames(state, 'moves', action.direction))
            // return sortGames(state, 'moves', action.direction)
            return state.sort((a, b) => {
                if ((a.moves).split(' ').length > (b.moves).split(' ').length) return (action.direction === 'asc' ? 1 : -1)
                else if ((a.moves).split(' ').length < (b.moves).split(' ').length) return (action.direction === 'asc' ? -1 : 1)
                return 0
            })
        case SORT_BY_RATING:
            // console.log(sortGames(state, 'rating', action.direction))
            // return sortGames(state, 'rating', action.direction)
            return state.sort((a, b) => {
                if (
                    ((a.players.white.rating + a.players.black.rating) / 2)
                    >
                    ((b.players.white.rating + b.players.black.rating) / 2)
                ) return (action.direction === 'asc' ? 1 : -1)
                else if (
                    ((a.players.white.rating + a.players.black.rating) / 2)
                    <
                    ((b.players.white.rating + b.players.black.rating) / 2)
                ) return (action.direction === 'asc' ? -1 : 1)
                return 0
            })
        default:
            return state;
    }
};

// const sortGames = (arr, pattern, direction) => {
//     if (pattern === 'date') {
//         return arr.sort((a, b) => {
//             if (a.createdAt > b.createdAt) return (direction === 'asc' ? 1 : -1)
//             else if (a.createdAt < b.createdAt) return (direction === 'asc' ? -1 : 1)
//             return 0
//         })
//     } else if (pattern === 'moves') {
//         return arr.sort((a, b) => {
//             if ((a.moves).split(' ').length > (b.moves).split(' ').length) return (direction === 'asc' ? 1 : -1)
//             else if ((a.moves).split(' ').length < (b.moves).split(' ').length) return (direction === 'asc' ? -1 : 1)
//             return 0
//         })
//     } else if (pattern === 'rating') {
//         return arr.sort((a, b) => {
//             if (
//                 ((a.players.white.rating + a.players.black.rating) / 2)
//                 >
//                 ((b.players.white.rating + b.players.black.rating) / 2)
//             ) return (direction === 'asc' ? 1 : -1)
//             else if (
//                 ((a.players.white.rating + a.players.black.rating) / 2)
//                 <
//                 ((b.players.white.rating + b.players.black.rating) / 2)
//             ) return (direction === 'asc' ? -1 : 1)
//             return 0
//         })
//     }
// }

const gamesReducers = {
    games,
    filteredGames
}

export default gamesReducers;