import fs from 'node:fs';
import readline from 'node:readline';

const file = fs.createReadStream('../train.csv', 'utf8')

const reader = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
})

const passengers = [];
const passengersByClass = {
    'first_Class': {fare: 0, count: 0},
    'second_Class': {fare: 0, count: 0},
    'third_Class': {fare: 0, count: 0},
};

let totalFare = 0;
let totalSurvived = 0;
let totalNonSurvived = 0;
let totalSurvivedMale = 0;
let totalSurvivedFemale = 0;
let totalSurvivedChild = 0;

let isFirstLine = true;


reader.on('line', (line) => {
    if (isFirstLine) {
        isFirstLine = false;
        return;
    }
    const cells = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    passengers.push({
        id: cells[0],
        survived: cells[1],
        Pclass: cells[2],
        name: cells[3],
        sex: cells[4],
        age: cells[5],
        sibsp: cells[6],
        parch: cells[7],
        ticket: cells[8],
        fare: cells[9],
        cabin: cells[10],
        embarked: cells[11],
    })

    totalFare += parseFloat(cells[9]);
    if (cells[1] === '1') {
        totalSurvived++;
        if (cells[4] === 'male' && cells[5] >= 18) {
            totalSurvivedMale++;
        } else if (cells[4] === 'female' && cells[5] >= 18) {
            totalSurvivedFemale++;
        } else {
            totalSurvivedChild++;
        }
    } else {
        totalNonSurvived++;
    }

    if (cells[2] === '1') {
        passengersByClass.first_Class.count++;
        passengersByClass.first_Class.fare += parseFloat(cells[9]);
    } else if (cells[2] === '2') {
        passengersByClass.second_Class.count++;
        passengersByClass.second_Class.fare += parseFloat(cells[9]);
    } else {
        passengersByClass.third_Class.count++;
        passengersByClass.third_Class.fare += parseFloat(cells[9]);
    }


})

reader.on('close', () => {
    console.log('Total Passengers: ', passengers.length)
    console.log('Total Fare: ', totalFare.toFixed(2))
    console.log('Average Fare: ', (totalFare / passengers.length).toFixed(2))
    console.log('Total Survived: ', totalSurvived)
    console.log('Total Non-Survived: ', totalNonSurvived)
    console.log('Total Survived Male: ', totalSurvivedMale)
    console.log('Total Survived Female: ', totalSurvivedFemale)
    console.log('Total Survived Child: ', totalSurvivedChild)
    for (const [key, value] of Object.entries(passengersByClass)) {
        console.log(`${key}, Count: ${value.count}, AVG_Fare: ${(value.fare / value.count).toFixed(2)}`)
    }
})



