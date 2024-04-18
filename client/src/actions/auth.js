import { AUTH, RESET_PASSWORD } from '../constants/actionTypes';
import * as api from '../api';

export const signin = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData);
        dispatch({ type: AUTH, data });

        navigate('/', { state: { status: 200, response: 'You\'ve successfully logged in!', activateT: false } });
    } catch (error) {
        const errMessage = error.response ? error.response.data.message : undefined;
        if (errMessage) {
            navigate('/', { status: error.response.status, state: { response: errMessage } });
        } else {
            navigate('/', { status: 500, state: { response: 'Something went wrong' } });
        }
    }
}

export const signup = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);

        // Save an array to check if user needs tours
        localStorage.setItem('tour', [0, 0, 0, 0]); // [Navbar, Apps, Research, ScoreSettings]
        
        dispatch({ type: AUTH, data });

        navigate('/', { state: { status: 200, response: 'You\'ve been registered. Welcome to ImApplicent!', activateT: true } });
    } catch (error) {
        const errMessage = error.response ? error.response.data.message : '';
        if (errMessage) {
            navigate('/', { status: error.response.status, state: { response: errMessage } });
        } else {
            navigate('/', { status: 500, state: { response: 'Something went wrong' } });
        }
    }
}

export const sendResetPasswordEmail = (email, navigate) => async (dispatch) => {
    try {
        await api.sendResetPasswordEmail(email);

        //navigate('/', { state: { status: 200, response: '' } });
    } catch (error) {
        const errMessage = error.response ? error.response.data.message : '';
        if (errMessage) {
            navigate('/', { status: error.response.status, state: { response: errMessage } });
        } else {
            navigate('/', { status: 500, state: { response: 'Something went wrong' } });
        }
    }
}

export const resetPassword = (token, password, navigate) => async (dispatch) => {
    try {
        const { data } = await api.resetPassword(token, password);

        dispatch({ type: RESET_PASSWORD, payload: data });

        navigate('/auth', { state: { status: 200, response: 'Password has been reset! Please login to your account' } });
    } catch (error) {
        navigate('/', { status: 500, state: { response: 'Something went wrong' } });
    }
}