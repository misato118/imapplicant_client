import { FETCH_SCORES, ADD_SCORES, UPDATE_SCORES } from '../constants/actionTypes';

// score includes appId, title, company, score
export default (score = [], action) => {
    switch (action.type) {
        case ADD_SCORES:
            return [...score, action.payload];
        case FETCH_SCORES:
            return action.payload;
        case UPDATE_SCORES:
            return score.map((scr) => scr.id === action.payload.id ? action.payload : scr);        
        default:
            return score;
    }
}