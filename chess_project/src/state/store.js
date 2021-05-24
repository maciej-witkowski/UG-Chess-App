import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import {createMiddleware} from 'redux-api-middleware';
import gamesReducers from "./games/reducers";
const rootReducer = combineReducers({games: gamesReducers.games})

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk, createMiddleware())
    )
);

export default store;
