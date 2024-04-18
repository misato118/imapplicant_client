import { ADD_BENEFIT, REMOVE_BENEFIT, FETCH_BENEFITS, UPDATE_BENEFIT } from '../constants/actionTypes';

// Unique benefits in array
export default (benefits = [], action) => {
    switch (action.type) {
        case ADD_BENEFIT:
            return [...benefits, action.payload];
        case REMOVE_BENEFIT:
            return '';
        case FETCH_BENEFITS:
            return action.payload;
        case UPDATE_BENEFIT:
            return '';
        default:
            return benefits;
    }
}