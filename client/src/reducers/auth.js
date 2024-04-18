import { AUTH, LOGOUT, RESET_PASSWORD } from '../constants/actionTypes';

const authReducer = (state = { authData: null }, action) => {
    switch (action.type) {
        case AUTH:
            localStorage.setItem('user', JSON.stringify({ ...action?.data }));
            return { ...state, authData: action?.data };
        case LOGOUT:
            localStorage.removeItem('user');
            localStorage.removeItem('apps');
            return { ...state, authData: null };
        case RESET_PASSWORD:
            localStorage.clear();
            return state;
        default:
            return state;
    }
}

export default authReducer;