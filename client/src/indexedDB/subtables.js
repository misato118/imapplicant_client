import { appDB } from '../db.js';
import { addSubTable } from '../actions/db_actions';
import { addScore } from './scores';

// Add unique data to subtables if it doesn't exist, or else just add app id to app_arr
async function addSubData(tableName, object) {
    var foundData = await appDB[tableName].get(object.id);

    if (foundData === undefined) { // id doesn't exist
        await appDB[tableName].add({id: object.id, app_arr: object.app_arr});

        // Only benefits, companies, and titles are related to score calc
        if (tableName !== 'status' && tableName !== 'requirements') {
            addScore(tableName, object.id);
        }
        addSubTable(tableName, object.id);

    } else { // id already exists
        var existingArr = foundData.app_arr;
        appDB[tableName].update(foundData.id, { app_arr: existingArr.concat(object.app_arr[0]) });
    }
}

async function removeSubData(tableName, object) {
    try {
        var foundData = await appDB[tableName].get(object.id);

        if (foundData !== undefined) {
            var existingArr = foundData.app_arr;

            if (existingArr.length > 1) {
                const index = existingArr.indexOf(object.id);

                if (index > -1) {
                    existingArr.split(index, 1);
                }
                
                appDB[tableName].update(foundData.id, { app_arr: existingArr });
            } else { // When there's only one id in the array
                appDB[tableName].delete(foundData.id);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export { addSubData, removeSubData };