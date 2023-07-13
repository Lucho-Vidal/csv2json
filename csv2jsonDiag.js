const fs = require("fs");

if (process.argv[2] === undefined) {
    console.error(`Usage: node csv2json.js <file.csv>`);
    process.exit(1);
}
const filename = process.argv[2];
const fileText = fs.readFileSync(filename).toString();
const allLines = fileText.split("\r\n");

//const header = allLines[0];
const dataLines = allLines.slice(1);
//const header = ["TURNO","Itinerario","Personal","Toma","Deja","Vuelta","TREN","REFER","ORIGEN","SALE","DESTINO","LLEGA","OBSERVACIONES"]
const header =
    "TURNO,Itinerario,Personal,Toma,Deja,Vuelta,TREN,REFER,ORIGEN,SALE,DESTINO,LLEGA,OBSERVACIONES".toLowerCase();
const fieldNames = header.split(",");

let objList = [];
let i = 0;
while (i<dataLines.length){
    if (dataLines[i] === "") {
        i++;
        //continue;
    }
    let turno = {};
    let vueltas = {};
    let lstVueltas = []

    if (dataLines[i] !== undefined) {
        let condition = true;
        if (dataLines[i].includes("Turno")) {
            let data = dataLines[i].split(",");
            turno['turno'] = data[1];
            //console.log(data[1]);
            if(data[1].includes('D')){
                turno['itinerario'] = 'D';
            }else if(data[1].includes("S")){
                turno['itinerario'] = 'S';
            }else{
                turno['itinerario'] = 'H';
            }

            i++;

            data = dataLines[i].split(",");
            turno['toma'] = data[2];
            turno['deja'] = data[4];
    
            i = i + 2;
                while (condition){
                for (let j = 5; j < fieldNames.length; j++) {
                    const fieldName = fieldNames[j].toLowerCase();
                    const asNumber = Number(data[j]);
                    if (asNumber == 0) {
                        continue;
                    } else if (isNaN(asNumber)) {
                        vueltas[fieldName] = data[j];
                    } else {
                        vueltas[fieldName] = asNumber;
                    }
                    lstVueltas.push(vueltas)
                    i++;
                }
            }
            turno["vueltas"] = lstVueltas;
            objList.push(turno);
        }else{
            i++;
        }
    } 
    
}

const jsonText = JSON.stringify(objList, null, 2);
const outputFilename = filename.replace(".csv", ".json");
fs.writeFileSync(outputFilename, jsonText);
console.log("Proceso terminado: ", outputFilename);
