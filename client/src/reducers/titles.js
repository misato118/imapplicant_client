import { ADD_TITLE, REMOVE_TITLE, FETCH_TITLES, UPDATE_TITLE } from '../constants/actionTypes';

export default (titles = [], action) => {
    switch (action.type) {
        case ADD_TITLE:
            return action.payload;
        case REMOVE_TITLE:
            return '';
        case FETCH_TITLES:
            return action.payload;
        case UPDATE_TITLE:
            return '';
        default:
            return titles;
    }
}