import { FETCH_CHI_SQUARE, ADD_CHI_SQUARE } from '../constants/actionTypes';


export default (chiSquareIndep = [], action) => {
    switch (action.type) {
        case FETCH_CHI_SQUARE:
            return action.payload;
        case ADD_CHI_SQUARE:
            return [...chiSquareIndep, action.payload];
        default:
            return chiSquareIndep; 
    }
}