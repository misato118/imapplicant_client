import { ADD_REQUIREMENT, REMOVE_REQUIREMENT, FETCH_REQUIREMENTS, UPDATE_REQUIREMENT } from '../constants/actionTypes';

export default (requirements = [], action) => {
    switch (action.type) {
        case ADD_REQUIREMENT:
            return [...requirements, action.payload];
        case REMOVE_REQUIREMENT:
            return '';
        case FETCH_REQUIREMENTS:
            return action.payload;
        case UPDATE_REQUIREMENT:
            return '';
        default:
            return requirements;
    }
}