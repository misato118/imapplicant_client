import { appDB, scoreDB } from '../db.js';

const min = 0; // Min value for normalization (items that are not in score settings)
const overallScore = 300; // Total score of overall: 100pt(companies) + 100pt(titles) + 100Pt(benefits)

// Add new data to scoreDB when unique data is added to appDB
// Its rank value is set to table data size + 1
async function addScore(tableName, id) {
    try {
        await scoreDB.open();
        const tableSize = await scoreDB[tableName].count(); // # of items in a score table

        await scoreDB[tableName].add({ id: id });
    } catch (error) {
        console.log(error);
    }
}

// Update score when user edited/update score settings
async function updateScores (fieldName, source, dest) {
    try {
        const leastRank = dest.length + 1;

        // Loop through dest array
        for (var i = 0; i < dest.length; i++) {
            await scoreDB[fieldName].where('id').equalsIgnoreCase(dest[i]).modify({ rank: i + 1 });
        }

        // Loop through source array
        for (var j = 0; j < source.length; j++) {
            await scoreDB[fieldName].where('id').equalsIgnoreCase(source[j]).modify({ rank: leastRank });
        }

        await calculateScores();

        const rankData = await scoreDB[fieldName].toArray();
        return rankData;
        
    } catch (error) {
        console.log(error);
    }
}

// Related fields are: benefits, companies, and titles
// SCORE benefits: min = 0pt, max = all set benefits pt, companies & titles: min = 0pt, max = length pt
async function calculateScores() {
    try {
        var result = []; // [{id: , score: },{},{},...]

        const appsData = await appDB['applications'].toArray(); // [{},{},{},...]

        const data = appsData.map(async (application) => {
            calSingleScore('companies', application.company).then((compScore) => {
                var totalScore = 0; // The total score of each application
                totalScore += compScore;
                calSingleScore('titles', application.title).then((titleScore) => {
                    totalScore += titleScore;
                    calMultiScore('benefits', application.benefits).then((beneScore) => {
                        totalScore += beneScore;
                        totalScore = (100 * totalScore) / (overallScore);

                        totalScore = Math.round(totalScore * 100) / 100; // Round to 2 decimals
                        result.push({ id: application.id, score: totalScore });

                        updateUserScore(application.id, totalScore);
                        
                    });
                });
            });
        });

    } catch (error) {
        console.log(error);
    }
}

async function updateUserScore(id, score) {
    try {
        await appDB['applications'].where('id').equals(id).modify({ score: score });
    } catch (error) {
        console.log(error);
    }
}

// Calculate single score such as companies and titles
async function calSingleScore(fieldName, id) { // fieldName = companies || titles
    const tableSize = await scoreDB[fieldName].count(); // max for normalization
    const objData = await scoreDB[fieldName].where({ id: id }).first();
    const xVal = objData ? objData.rank ? (tableSize - objData.rank) : 0 : 0;

    const result = (100 * (xVal - min)) / (tableSize);

    return result; // Normalization calc
}

// Calculate multiple scores such as benefits
// max = addition of all benefits' scores, min = 0 (no benefits)
async function calMultiScore(fieldName, arr) { // arr = item arr from each app
    var sum = 0; var max = 0;
    const tableSize = await scoreDB[fieldName].count(); 
    const scoreTableData = await scoreDB[fieldName].toArray();

    // Sum up all items in the score table and arr
    scoreTableData.map((item) => {
        const score = item.rank == undefined ? 0 : (tableSize - item.rank);
        max += score; // Add up for max score
        sum += arr.includes(item.id) ? score : 0;
    });

    var result = (100 * (sum)) / max;
    return result;
}

export { addScore, updateScores, calculateScores };