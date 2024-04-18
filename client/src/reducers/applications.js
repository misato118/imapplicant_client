import { ADD, REMOVE, FETCH, FETCH_ALL, UPDATE } from '../constants/actionTypes';

export default (applications = [], action) => {
    switch (action.type) {
        case ADD:
            const addedApp = [...applications, action.payload];
            handleLocalStorage(addedApp);
            return addedApp;
        case REMOVE:
            var refIdArr = action.payload.map((obj) => {return obj.ref_id});

            applications = applications.filter((application) => {
                if (!refIdArr.includes(application.ref_id)) {
                    return application;
                }
            });
            handleLocalStorage(applications);
            return applications;
        case FETCH:
            return applications;
        case FETCH_ALL:
            handleLocalStorage(action.payload);
            return action.payload;
        case UPDATE:
            const updatedApp = applications.map((application) => application.ref_id === action.payload.ref_id ? action.payload : application);
            handleLocalStorage(updatedApp);
            return updatedApp;
        default:
            return applications;
    }
}

function handleLocalStorage(newData) {
    localStorage.removeItem('apps');
    localStorage.setItem('apps', JSON.stringify(newData));
}