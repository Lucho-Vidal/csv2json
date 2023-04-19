const { log } = require('console');
const fs = require('fs');

if(process.argv[2]===undefined){
    console.error(`Usage: node csv2json.js <file.csv>`);
    process.exit(1);
}

const filename = process.argv[2];
const fileText = fs.readFileSync(filename).toString();
const allLines = fileText.split('\r\n');

const header = allLines[0];
const dataLines = allLines.slice(1);

const fieldNames = header.split(',');

let objList = [];
for (let i = 0; i < dataLines.length; i++ ){
    if (dataLines[i] === ""){
        continue;
    }
    let obj = {};
    const data = dataLines[i].split(',');

    for (let j = 0; j < fieldNames.length; j++){
        const fieldName = fieldNames[j].toLowerCase();//toLowerCase()
        const asNumber = Number(data[j]);
        obj[fieldName] = isNaN(asNumber) ? data[j] : asNumber;

    }
    objList.push(obj);
}
const jsonText = JSON.stringify(objList, null, 2);
const outputFilename = filename.replace(".csv",".json");
fs.writeFileSync(outputFilename, jsonText);