import { FETCH_REQ_RESEARCH, ADD_REQ_RESEARCH } from '../constants/actionTypes';


export default (reqResearch = [], action) => {
    switch (action.type) {
        case FETCH_REQ_RESEARCH:
            return action.payload;
        case ADD_REQ_RESEARCH:
            return [...reqResearch, action.payload];
        default:
            return reqResearch; 
    }
}