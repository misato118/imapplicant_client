import { ADD_RANKING, FETCH_RANKINGS, UPDATE_RANKINGS } from '../constants/actionTypes';

// rankings = { benefits: [], companies: [], titles: [] }
export default (rankings = {}, action) => {
    switch (action.type) {
        case ADD_RANKING:
            return { ...rankings, [action.payload.fieldName]: action.payload.data };
        case FETCH_RANKINGS:
            return action.payload;
        case UPDATE_RANKINGS:
            rankings[action.payload.fieldName] = action.payload.data;
            return rankings;
        default:
            return rankings;
    }
}