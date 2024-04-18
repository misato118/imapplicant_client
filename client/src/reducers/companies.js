import { ADD_COMPANY, REMOVE_COMPANY, FETCH_COMPANIES, UPDATE_COMPANY } from '../constants/actionTypes';

export default (companies = [], action) => {
    switch (action.type) {
        case ADD_COMPANY:
            return [...companies, action.payload];
        case REMOVE_COMPANY:
            return '';
        case FETCH_COMPANIES:
            return action.payload;
        case UPDATE_COMPANY:
            return '';
        default:
            return companies;
    }
}