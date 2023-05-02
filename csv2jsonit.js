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
    let tren = {};
    let estaciones = [];
    let horarios = [];
    
    const data = dataLines[i].split(',');

    for (let j = 1; j < fieldNames.length; j++){
        const asNumber = Number(data[j]);

        if(asNumber==0){
            continue
        }
        else if(isNaN(asNumber)){
            estaciones.push(fieldNames[j].toUpperCase())
            horarios.push(data[j]) 
            tren = {
                tren:Number(data[0]),
                estaciones,
                horarios        
            };
        }
        
    }
    
    objList.push(tren);
}

const jsonText = JSON.stringify(objList, null, 2);
const outputFilename = filename.replace(".csv",".json");
fs.writeFileSync(outputFilename, jsonText);
console.log('Proceso terminado: ',outputFilename)