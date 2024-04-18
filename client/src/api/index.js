import axios from 'axios'; // A Javascript library to make HTTP requests from node.js or XMLHttpRequests from the browser.

//const API = axios.create({ baseURL: 'http://localhost:5000' }); // API is an instance of axios
const API = axios.create({ baseURL: 'https://web-server-imapplicant-server.onrender.com' }); // API is an instance of axios

API.interceptors.request.use((req) => {
    if (localStorage.getItem('user')) {
        var obj = JSON.parse(localStorage.getItem('user'));
        if (obj.token) {
            req.headers.Authorization = "Bearer " + obj.token;
        }
    }

    return req;
});

export const createApplication = (id, newApplication) => API.post('/applications', { id: id, app: newApplication });
export const getApplications = () => API.get('/applications');
export const updateApplication = (id, updatedApp, mongoAppId) => API.put('/applications', { appId: id, updatedApp: updatedApp, refId: mongoAppId });
export const deleteApplication = (ids) => API.delete('applications', { data: ids });

export const addRequirements = (requirements, id) => API.post('/research_requirements', { requirements: requirements, id: id });
export const getResearchRequirements = () => API.get('/research_requirements');

export const getFieldValues = (url) => API.post('/applications/autoComplete', { url: url });
export const getChicalc = (appId, newStatus) => API.post('/applications/association', { appId: appId, newStatus: newStatus });

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const sendResetPasswordEmail = (email) => API.post('/user/send_reset_password', { email: email });
export const resetPassword = (token, password) => API.post('/user/reset_password', { token: token, password: password });