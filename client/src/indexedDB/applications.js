import { researchDB } from '../db.js';
import { addSubData, removeSubData } from './subtables';
import * as api from '../api';
import { addResearchReq } from '../actions/db_actions';

const subTables = ['benefits', 'requirements']; // sub tables which includes an array

// Add data to IndexedDB when submitting a create app form 
async function addToApps (id, formData) {
    try {
        // Add unique data if it doesn't exist in the table
        // if it does, just add id to app_arr
        addSubData('status', { id: formData.status, app_arr: [id] });
        addSubData('titles', { id: formData.title, app_arr: [id] });
        addSubData('companies', { id: formData.company, app_arr: [id] });

        console.log('addData ' + id);

        // Loop through array for benefits and requirements
        for (var i = 0; i < subTables.length; i++) {
            const newDataArr = formData[subTables[i]];
            for (var j = 0; j < newDataArr.length; j++) {
                addSubData(subTables[i], { id: newDataArr[j], app_arr: [id] });
            }
        }

        // Pass all requirements in app
        const { data } = await api.addRequirements(formData.requirements, id);
        addResearchRequirements(data);
    } catch (error) {
        console.log('Error! ' + error);
    }
    
}

async function addResearchRequirements(data) {
    try {
        await researchDB.open();
        await researchDB.frequencies.clear();

        if (!data) {
            return;
        }

        data.map((eachK) => {
            var result = {};
            const kValue = eachK.kValue;
            var frequency = [];
            eachK.frequency.map((eachCombi) => {
                delete eachCombi._id; // Remove unnecessary items
                frequency.push(eachCombi);
            });
            result.id = kValue;
            result.frequency = frequency;
            addResearchReqToDB(result);
        });
    } catch (error) {
        console.log(error);
    }    
}

async function addResearchReqToDB(data) {
    try {
        const id = await researchDB.frequencies.add(data);
        addResearchReq(data); // dispatch in db_actions
    } catch (error) {
        console.log(error);
    }
}

// Update app when user edited and submitted
async function updateApp(origFormData, newFormData, updatedAppId) {
    try {
        // Update unique data if it exists in the table
        // if it doesn't, just remove id from app_arr
        if (origFormData.status != newFormData.status) {
            removeSubData('status', { id: origFormData.status, app_arr: [origFormData.id] });
            addSubData('status', { id: newFormData.status, app_arr: [updatedAppId] });
        }

        if (origFormData.titles != newFormData.titles) {
            removeSubData('titles', { id: origFormData.titles, app_arr: [origFormData.id] });
            addSubData('titles', { id: newFormData.titles, app_arr: [updatedAppId] });
        }

        if (origFormData.companies != newFormData.companies) {
            removeSubData('companies', { id: origFormData.companies, app_arr: [origFormData.id] });
            addSubData('companies', { id: newFormData.companies, app_arr: [updatedAppId] });
        }

        // Loop through array for benefits and requirements
        for (var i = 0; i < subTables.length; i++) {
            const modifiedArr = findCommonItem(origFormData[subTables[i]], newFormData[subTables[i]]); // Items to ignore

            for (var j = 0; j < modifiedArr.origArr.length; j++) {
                removeSubData(subTables[i], { id: modifiedArr.origArr[j], app_arr: [updatedAppId] });
            }

            for (var k = 0; k < modifiedArr.newArr.length; k++) {
                addSubData(subTables[i], { id: modifiedArr.newArr[k], app_arr: [updatedAppId] });
            }            
        }

        // Pass all requirements in app
        const { data } = await api.addRequirements(newFormData.requirements, updatedAppId);
        addResearchRequirements(data);
    } catch (error) {
        console.log('Error! ' + error);
    }
}

// Get two arrays and return common items in array
function findCommonItem(origArr, newArr) {
    var common = [];
    
    for (var i = 0; i < origArr.length; i++) {
        if (newArr.includes(origArr[i])) {
            common.push(origArr[i]);
        }
    }
    
    // Remove common items from both arrays
    for (var j = 0; j < common.length; j++) {
        if (origArr.includes(common[j])) {
            const index = origArr.indexOf(common[j]);
            origArr.splice(index, 1);
        }
        if (newArr.includes(common[j])) {
            const index = newArr.indexOf(common[j]);
            newArr.splice(index, 1);
        }
    }

    return { origArr: origArr, newArr: newArr };
}

export { addToApps, updateApp };