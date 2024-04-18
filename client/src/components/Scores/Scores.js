import React, { useEffect, useState } from 'react';
import { getAll, getScores, getAllRankings } from '../../actions/db_actions';
import { useDispatch } from 'react-redux';
import Score_Settings from './Score_Settings';
import Scores_result from './Scores_result';
import { useLocation } from 'react-router-dom';

const Scores = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    let pageName = location.state.pageName;
    let isLoggedin =  location.state.isLoggedin;

    const [user, setUser] = useState(isLoggedin);

    useEffect(() => {
        dispatch(getAll('benefits', user));
        dispatch(getAll('companies', user));
        dispatch(getAll('titles', user));
        dispatch(getScores());
        dispatch(getAllRankings());
    }, [dispatch]);

    return (
        <>
            { pageName === 'results' ?
                <div style={{  display: 'flex', textAlign: 'center' }}>
                    <Scores_result />
                </div>
                : user ? <Score_Settings />
                : <></>
            }
        </>
        
    );
}

export default Scores;