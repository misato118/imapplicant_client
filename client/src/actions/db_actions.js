import { appDB, scoreDB, researchDB } from '../db.js';
import { ADD, UPDATE, REMOVE, FETCH_ALL, FETCH_BENEFITS, FETCH_COMPANIES, FETCH_TITLES,
    ADD_BENEFIT, ADD_COMPANY, ADD_TITLE, FETCH_REQ_RESEARCH, ADD_SCORES, ADD_REQ_RESEARCH,
    FETCH_CHI_SQUARE, ADD_CHI_SQUARE, FETCH_SCORES, ADD_RANKING, FETCH_RANKINGS }  from '../constants/actionTypes.js';
import { addToApps, updateApp } from '../indexedDB/applications';
import { updateScores } from '../indexedDB/scores';
import * as api from '../api';

// db_actions deals with dispatch data
var appIdGlobal = -1;

// Add data to IndexedDB (applictaions table) when submitting a create app form 
export const addData = (formData) => async(dispatch, navigate) => {
    try {
        // Add formData to the applications table
        await appDB.open();
        await scoreDB.open();

        // If online, cannot connect to MongoDB
        if (!window.navigator.onLine) {
            console.log('Offline');
            return;
        }

        // Add a new app to IndexedDB and get its local id
        const id = await appDB.applications.add(formData);
        appIdGlobal = id;

        // Send to server and mongodb
        const { data } = await api.createApplication(id, formData);

        // If server responds success and added a new app, then add the rest to IndexedDB
        appDB.applications.update(id, { ref_id: data._id }).then(function (updated) {
            if (updated) {
                addToApps(id, formData);
                formData.id = id;
                formData.ref_id = data._id;
                dispatch({ type: ADD, payload: formData });
            } else { // Or else do nothing and remove the id
                appDB.applications.delete(id);
            }
        });

    } catch (error) {
        console.log('Error! ' + error);

        appDB.applications.delete(appIdGlobal);
        //window.location = 'http://localhost:3000/error';
        window.location = 'https://imapplicant-client.onrender.com/error';
    }
}

// Update data to IndexedDB (applictaions table)
export const updateData = (formData, updatedAppId, mongoAppId) => async(dispatch) => {
    try {
        await appDB.open();
        await scoreDB.open();

        // If online, cannot connect to MongoDB
        if (!window.navigator.onLine) {
            return;
        }
        
        const { data } = await api.updateApplication(updatedAppId, formData, mongoAppId);
        if (data.message == 'Application Updated') {
            //Add formData to the applications table
            formData.ref_id = mongoAppId;
            const appData = await appDB.applications.get(updatedAppId);
            await appDB.applications.update(updatedAppId, formData);

            updateApp(appData, formData, updatedAppId); // Pass original data and modified data
            dispatch({ type: UPDATE, payload: formData });
        }

    } catch (error) {
        console.log('Error! ' + error);
        //window.location = 'http://localhost:3000/error';
        window.location = 'https://imapplicant-client.onrender.com/error';
    }  
}

// 
export const addSubTable = (tableName, id) => async(dispatch) => {
    // Add a unique item to the store (payload == unique name)
    if (tableName === 'benefits') {
        dispatch({ type: ADD_BENEFIT, payload: id });
    } else if (tableName === 'companies') {
        dispatch({ type: ADD_COMPANY, payload: id });
    } else if (tableName === 'titles') {
        dispatch({ type: ADD_TITLE, payload: id });
    }
}

// Get all data from a table
export const getAll = (tableName, user) => async(dispatch) => {
    try {
        let dispatchData;
        const mongoData = tableName == 'applications' && user ? await api.getApplications() : undefined;
        const localData = await appDB[tableName].toArray();
        
        dispatchData = mongoData ? mongoData.data : localData;

        if (tableName === 'applications') {
            localData.map((data) => {
                delete data.local_id;
                delete data.status;
                delete data.post_url;
                delete data.location;
                delete data.income;
                delete data.benefits;
                delete data.requirements;
                delete data.date;
                delete data.status_history;
            });

            // Dispatch calculated scores
            dispatch({ type: ADD_SCORES, payload: localData });

            const fullAppData = await appDB[tableName].toArray();
            dispatch({ type: FETCH_ALL, payload: fullAppData });
        } else if (tableName === 'benefits') {
            dispatch({ type: FETCH_BENEFITS, payload: dispatchData });
        } else if (tableName === 'companies') {
            dispatch({ type: FETCH_COMPANIES, payload: dispatchData });
        } else if (tableName === 'titles') {
            dispatch({ type: FETCH_TITLES, payload: dispatchData });
        }

    } catch (error) {
        console.log(error);

        var errorName = error.response;
        if (errorName) {
            if (errorName.data) {
                if (errorName.data == 'No user found') {
                    //window.location = 'http://localhost:3000/auth';
                    window.location = 'https://imapplicant-client.onrender.com/auth';
                } else if (errorName.data.message == 'TokenExpiredError') { // If TokenExpiredError occurs on server side, just make the user logout
                    dispatch({ type: 'LOGOUT' });
                }
            }
        }
    }
}

export const getResearchReq = () => async(dispatch) => {
    try {
        const fetchedData = await researchDB['frequencies'].toArray();

        dispatch({ type: FETCH_REQ_RESEARCH, payload: fetchedData });
    } catch (error) {
        console.log(error);
    }
}

export const getScores = () => async(dispatch) => {
    try {
        const scoreData = await appDB['applications'].toArray();

        dispatch({ type: FETCH_SCORES, payload: scoreData });
    } catch (error) {
        console.log(error);
    }
}

export const getAllRankings = () => async(dispatch) => {
    try {
        const beneRankData = await scoreDB['benefits'].toArray();
        const compRankData = await scoreDB['companies'].toArray();
        const titleRankData = await scoreDB['titles'].toArray();

        const dispatchObj = { benefits: beneRankData, companies: compRankData, titles: titleRankData };

        dispatch({ type: FETCH_RANKINGS, payload: dispatchObj });
    } catch (error) {
        console.log(error);
    }
}

// This is not called
export const addResearchReq = (data) => async(dispatch) => {
    try {
        dispatch({ type: ADD_REQ_RESEARCH, payload: data });
    } catch (error) {
        console.log(error);
    }
}

// Calculate scores but cannot dispatch to score reducer yet
// (When loading Home, get calculated scores from local db and dispatch)
// Here just dispatch rankings
export const updateAppScores = (fieldName, source, dest) => async(dispatch) => {
    try {
        const data = await updateScores(fieldName, source, dest);

        const dispatchData = { fieldName: fieldName, data: data }
        dispatch({ type: ADD_RANKING, payload: dispatchData });
    } catch (error) {
        console.log(error);
    }
}

export const deleteApplications = (deleteNum, appIds) => async(dispatch) => {
    // Delete selected apps on MongoDB & IndexedDB
    try {
        const deleteRes = await api.deleteApplication(appIds);

        if (deleteRes.status == 200) {
            const apps = await appDB.applications.where('ref_id').anyOf(appIds).toArray();

            apps.map((app) => {
                appDB.applications.delete(app.id);
            });

            dispatch({ type: REMOVE, payload: apps });
        }
    } catch (error) {
        console.log(error);
    }
}

// Update status of app and calculate associations with chi square
export const updateStatus = (app, newStatus) => async(dispatch) => {
    try {
        // Run chi-square --> Add data to MongoDB & IndexedDB
        const chiCalc = await api.getChicalc(app.ref_id, newStatus);

        if (chiCalc.status !== 200) {
            return;
        }

        // Add data to IndexedDB
        await researchDB.open();
        
        var allData = [];
        for (const [key, value] of Object.entries(chiCalc.data.combined)) {
            allData.push({ id: key, is_associated: value.is_associated, table: value.table });
        }

        await researchDB.associations.bulkPut(allData);

        await appDB.applications.update(app.id, { status: newStatus });
        
        app.status = newStatus;
        dispatch({ type: UPDATE, payload: app });

        // Dispatch data to reducer
        dispatch({ type: ADD_CHI_SQUARE, payload: chiCalc.data.combined });
    } catch (error) {
        var errorName = error.response;
        if (errorName) {
            if (errorName.data) {
                if (errorName.data == 'No user found') {
                    //window.location = 'http://localhost:3000/auth';
                    window.location = 'https://imapplicant-client.onrender.com/auth';
                } else if (errorName.data.message == 'TokenExpiredError') { // If TokenExpiredError occurs on server side, just make the user logout
                    dispatch({ type: 'LOGOUT' });
                    //window.location = 'http://localhost:3000/auth';
                    window.location = 'https://imapplicant-client.onrender.com/auth';
                }
            }
        }
    }
}

export const getChiSquareIndep = () => async(dispatch) => {
    try {
        const fetchedData = await researchDB['associations'].toArray();

        dispatch({ type: FETCH_CHI_SQUARE, payload: fetchedData });
    } catch (error) {
        console.log(error);
    }
}