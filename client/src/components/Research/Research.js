import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getResearchReq, getChiSquareIndep } from '../../actions/db_actions';
import Research_Req from './Research_Req/Research_Req';
import Research_Assoc from './Research_Assoc/Research_Assoc';

const Research = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    let pageName = location.state.pageName;
    let isLoggedin =  location.state.isLoggedin;

    const [user, setUser] = useState(isLoggedin);

    useEffect(() => {
        dispatch(getResearchReq());
        dispatch(getChiSquareIndep());
    }, [dispatch]);

    return(
        <>
            { user ? pageName === 'frequency'
                ? <div style={{ display: 'flex', justifyContent: 'center' }}><Research_Req /></div>
            : (
                <Research_Assoc />
            ) : <></>}
        </>
    );
}

export default Research;