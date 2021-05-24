import {SORT_BY_DATE, SORT_BY_MOVES, SORT_BY_RATING} from "../types";

export const sortByDate = direction => {
    return {
        type: SORT_BY_DATE,
        direction: direction
    };
};

export const sortByMoves = direction => {
    return {
        type: SORT_BY_MOVES,
        direction: direction
    };
};

export const sortByRating = direction => {
    return {
        type: SORT_BY_RATING,
        direction: direction
    };
};